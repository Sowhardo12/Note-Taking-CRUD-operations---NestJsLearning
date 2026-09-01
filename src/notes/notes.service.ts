// notes.service.ts
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import Database from 'better-sqlite3';
import { Note } from './note.model';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { GetNotesFilterDto } from './dto/get-notes-filter.dto';

@Injectable()
export class NotesService implements OnModuleInit {
  private db!: Database.Database;

  onModuleInit() {
    this.db = new Database('notes.db');
    
    // Create Table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);

    this.seedInitialData();
  }

  private seedInitialData(): void {
    const countRow = this.db.prepare('SELECT COUNT(*) as count FROM notes').get() as { count: number };
    if (countRow.count === 0) {
      const insert = this.db.prepare(
        'INSERT INTO notes (id, title, content, createdAt) VALUES (?, ?, ?, ?)'
      );
      
      const seedNotes = [
        { id: 'n1', title: 'Buy milk organic', content: 'Get organic whole milk.', createdAt: new Date().toISOString() },
        { id: 'n2', title: 'Learn NestJS DB', content: 'Master raw SQL queries and SQLite integration.', createdAt: new Date().toISOString() },
        { id: 'n3', title: 'System Architecture', content: 'Design containerized microservices and backend systems.', createdAt: new Date().toISOString() }
      ];

      for (const note of seedNotes) {
        insert.run(note.id, note.title, note.content, note.createdAt);
      }
    }
  }

  getAllNotes(filterNoteDto: GetNotesFilterDto): Note[] {
  const { search } = filterNoteDto;
  if (search) {
    const stmt = this.db.prepare('SELECT * FROM notes WHERE LOWER(title) LIKE LOWER(?)');
    return stmt.all(`%${search}%`) as Note[];
  }
  return this.db.prepare('SELECT * FROM notes').all() as Note[];
}

  getNoteById(id: string): Note {
    const stmt = this.db.prepare('SELECT * FROM notes WHERE id = ?');
    const note = stmt.get(id) as Note | undefined;
    if (!note) {
      throw new NotFoundException('Note Does not Exist');
    }
    return note;
  }


  createNote(createNoteDto: CreateNoteDto): Note {
  const { title, content } = createNoteDto;
  const newNote: Note = {
    id: Math.random().toString(36).substring(2, 9),
    title,
    content,
    createdAt: new Date().toISOString(),
  };

  const q = this.db.prepare(
    'INSERT INTO notes (id, title, content, createdAt) VALUES (?, ?, ?, ?)'
  );
  q.run(newNote.id, newNote.title, newNote.content, newNote.createdAt);

  return newNote;
  }

  checkHealth() {
    return { status: 'OK' };
  }

  resetSystem(): { message: string } {
    this.db.prepare('DELETE FROM notes').run();
    this.seedInitialData();
    return { message: 'reset successful' };
  }
}