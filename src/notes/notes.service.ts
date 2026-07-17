import { Injectable,NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './note.model';


@Injectable()
export class NotesService {
  private notes : Note[] = [];
  
  checkHealth(){
    return {"status":"OK"};
  }

  getAllNotes():Note[]{
    return this.notes;
  }
  getNoteById(id:string):Note{
    const found = this.notes.find((n)=>n.id===id);
    if(!found){throw new NotFoundException('Note Does not Exist')}
    return found;

  }
  createNote(createNoteDto:CreateNoteDto):Note{
    const {title,content} = createNoteDto;
    const newNote:Note = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      content,
      createdAt: new Date(),
    };
    this.notes.push(newNote);
    return newNote;
  }
  updateNote(id:string, updateNoteDto:UpdateNoteDto):Note{
    const found = this.getNoteById(id);
    if(!found){throw new NotFoundException('Note not found')}
    Object.assign(found,updateNoteDto);
    return found;
  }
  deleteNote(id:string):void{
    const found = this.getNoteById(id);
    if(!found){throw new NotFoundException('Note not found')}
    this.notes = this.notes.filter((note)=>{note.id!==found.id});
  }
}
