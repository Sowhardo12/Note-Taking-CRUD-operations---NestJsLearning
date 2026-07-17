import { Injectable,NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './note.model';
import { GetNotesFilterDto } from './dto/get-notes-filter.dto';

@Injectable()
export class NotesService {
  private notes : Note[] = [];
  
  constructor(){this.seedInitialData();}
  
  seedInitialData(): void {
    this.notes = [
      { id: 'n1', title: 'Buy milk', content: 'Get organic whole milk from the grocery store.', createdAt: new Date() },
      { id: 'n2', title: 'Learn NestJS', content: 'Master modules, services, and dynamic DTO validation rules.', createdAt: new Date() },
      { id: 'n3', title: 'System Architecture', content: 'Design containerized microservices and ledger lines.', createdAt: new Date() }
    ];
  }


  checkHealth(){
    return {"status":"OK"};
  }

  getAllNotes(filterNoteDto : GetNotesFilterDto):Note[]{
    const {search} = filterNoteDto;
    let tempNotes = this.notes;
    if(search){
      //modify the tempNotes
      tempNotes = tempNotes.filter((note)=>note.title.toLowerCase().includes(search.toLowerCase()));
    }
    return tempNotes;
  }

  resetSystem(): {message:string} {
    this.seedInitialData();
    return {message:'reset successful'}
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
