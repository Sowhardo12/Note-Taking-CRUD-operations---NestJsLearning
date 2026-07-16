import { Controller, Get, Post,Put, Delete,Body, Param } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import type { Note } from './note.model';

@Controller('notes')
export class NotesController {
  constructor(private noteService:NotesService){}
  @Get('/healthCheck')
  getHealthChecked():any{
    return this.noteService.checkHealth();
  }
  @Get()
  getAllNotes():Note[]{
    return this.noteService.getAllNotes();
  }
  @Get(':id')
  getNoteById(@Param('id') id:string):Note{
    return this.noteService.getNoteById(id);
  }
  @Post()
  createNote(@Body() createNoteDto:CreateNoteDto):Note{
    return this.noteService.createNote(createNoteDto);
  }
  @Put(':id')
  updateNote(@Param('id') id:string,@Body() updateNoteDto:UpdateNoteDto):Note{
    return this.noteService.updateNote(id,updateNoteDto);

  }
  @Delete(':id')
  deleteNote(@Param('id') id:string):void{
    return this.noteService.deleteNote(id);
  }
}
