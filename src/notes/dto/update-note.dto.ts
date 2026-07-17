import { CreateNoteDto } from "./create-note.dto";
import { PartialType } from "@nestjs/swagger";

export class UpdateNoteDto extends PartialType(CreateNoteDto){}