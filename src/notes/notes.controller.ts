import { Controller, Get, Post,Put, Delete,Body, Param, Query } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import type { Note } from './note.model';
import { ApiTags,ApiOperation,ApiResponse } from '@nestjs/swagger';
import { GetNotesFilterDto } from './dto/get-notes-filter.dto';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private noteService:NotesService){}
  @Get('/healthCheck')
  @ApiOperation({ summary: 'Check Server Health' })
  @ApiResponse({ status: 200, description: 'Health Status returned successfully.' })
  getHealthChecked():any{
    return this.noteService.checkHealth();
  }

  @Post('reset')
  @ApiOperation({ summary: 'Purge active mutations and reload the seed baseline dataset' })
  resetSystem(){
    return this.noteService.resetSystem();
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all existing notes' })
  @ApiResponse({ status: 200, description: 'Array of notes returned successfully.' })
  getAllNotes(@Query() filterNoteDto: GetNotesFilterDto):Promise<Note[]>{
    return this.noteService.getAllNotes(filterNoteDto);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single note by its unique ID string' })
  @ApiResponse({ status: 200, description: 'The requested note object matching the ID parameter.' })
  @ApiResponse({ status: 404, description: 'Target note entity could not be found.' })
  getNoteById(@Param('id') id:string):Promise<Note>{
    return this.noteService.getNoteById(id);
  }
  @Post()
  @ApiOperation({ summary: 'Create and append a new note record' })
  @ApiResponse({ status: 201, description: 'The note entity was successfully created and validated.' })
  @ApiResponse({ status: 400, description: 'Inbound body data failed validation assertions.' })
  createNote(@Body() createNoteDto:CreateNoteDto):Promise<Note>{
    return this.noteService.createNote(createNoteDto);
  }
  @Put(':id')
  @ApiOperation({ summary: 'Update parameters on an existing note' })
  @ApiResponse({ status: 200, description: 'The target note entity was altered successfully.' })
  @ApiResponse({ status: 404, description: 'Target note resource not found.' })
  updateNote(@Param('id') id:string,@Body() updateNoteDto:UpdateNoteDto):Promise<Note>{
    return this.noteService.updateNote(id,updateNoteDto);

  }
  @Delete(':id')
  @ApiOperation({ summary: 'Remove a note entity completely from memory storage' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 404, description: 'Target note entity could not be found.' })
  deleteNote(@Param('id') id:string):void{
    return this.noteService.deleteNote(id);
  }
}
