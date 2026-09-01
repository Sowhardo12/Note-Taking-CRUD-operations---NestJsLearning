// notes.service.ts
import { Injectable, NotFoundException, OnModuleInit ,OnModuleDestroy} from '@nestjs/common';
import Database from 'better-sqlite3';
import { Note } from './note.model';
import { Pool } from 'pg';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { GetNotesFilterDto } from './dto/get-notes-filter.dto';

@Injectable()
export class NotesService implements OnModuleInit,OnModuleDestroy {
  private pool!: Pool;

  onModuleInit() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgres://postgres:dev@localhost:5432/tasks',
    });
    this.initDb();
  }
  async onModuleDestroy() {
    await this.pool.end();
  }

  private async initDb(): Promise<void> {
    // Create Table if missing
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id VARCHAR(50) PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.seedInitialData();
  }


  private async seedInitialData(): Promise<void> {
    const res = await this.pool.query('SELECT COUNT(*) FROM notes');
    const count = parseInt(res.rows[0].count, 10);

    if (count === 0) {
      const seedNotes = [
        { id: 'n1', title: 'Buy milk organic', content: 'Get organic whole milk.', createdAt: new Date() },
        { id: 'n2', title: 'Learn NestJS DB', content: 'Master raw SQL queries and PostgreSQL integration.', createdAt: new Date() },
        { id: 'n3', title: 'System Architecture', content: 'Design containerized microservices and backend systems.', createdAt: new Date() }
      ];

      for (const note of seedNotes) {
        await this.pool.query(
          'INSERT INTO notes (id, title, content, "createdAt") VALUES ($1, $2, $3, $4)',
          [note.id, note.title, note.content, note.createdAt]
        );
      }
    }
  }

    async getAllNotes(filterNoteDto: GetNotesFilterDto): Promise<Note[]> {
    const { search } = filterNoteDto;
    //as search is optional
    if (search) {
      const query = 'SELECT * FROM notes WHERE LOWER(title) LIKE LOWER($1)';
      const res = await this.pool.query(query, [`%${search}%`]);
      return res.rows;
    }
    const res = await this.pool.query('SELECT * FROM notes');
    return res.rows;
  }

  async getNoteById(id: string): Promise<Note> {
    const res = await this.pool.query('SELECT * FROM notes WHERE id = $1', [id]);
    if (res.rows.length === 0) {
      throw new NotFoundException('Note Does not Exist');
    }
    return res.rows[0];
  }
  
  async createNote(createNoteDto: CreateNoteDto): Promise<Note> {
    const { title, content } = createNoteDto;
    const id = Math.random().toString(36).substring(2, 9);
    const createdAt = new Date();

    const res = await this.pool.query(
      'INSERT INTO notes (id, title, content, "createdAt") VALUES ($1, $2, $3, $4) RETURNING *',
      [id, title, content, createdAt]
    );
    return res.rows[0];
  }

  async updateNote(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const existingNote = await this.getNoteById(id); 

    const updatedTitle = updateNoteDto.title ?? existingNote.title;
    const updatedContent = updateNoteDto.content ?? existingNote.content;

    const res = await this.pool.query(
      'UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [updatedTitle, updatedContent, id]
    );
    return res.rows[0];
  }

  async deleteNote(id: string): Promise<void> {
    await this.getNoteById(id); 
    await this.pool.query('DELETE FROM notes WHERE id = $1', [id]);
  }

  checkHealth() {
    return { status: 'OK' };
  }

  async resetSystem(): Promise<{ message: string }> {
    await this.pool.query('DELETE FROM notes');
    await this.seedInitialData();
    return { message: 'reset successful' };
  }

  
}