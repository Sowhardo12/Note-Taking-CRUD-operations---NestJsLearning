
import { IsNotEmpty, MinLength, IsString } from "class-validator";
export class CreateNoteDto{

  @IsString()
  @IsNotEmpty()
  @MinLength(12,{message:'title must be 12 char long'})
  title!:string;

  @IsString()
  @IsNotEmpty()
  content!:string;
}