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




  
  checkHealth() {
    return { status: 'OK' };
  }

  async resetSystem(): Promise<{ message: string }> {
    await this.pool.query('DELETE FROM notes');
    await this.seedInitialData();
    return { message: 'reset successful' };
  }

  
}