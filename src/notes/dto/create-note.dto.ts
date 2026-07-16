
import { IsNotEmpty, MinLength, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateNoteDto{
  @ApiProperty({
    description: 'The distinct title of the note resource',
    example: 'Master Backend Architecture',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(12,{message:'title must be minimum 12 char long'})
  title!:string;

  @ApiProperty({
    description: 'Detailed main body content text for the note',
    example: 'Deep dive into low-level request life cycles and custom validations.',
  })
  @IsString()
  @IsNotEmpty()
  content!:string;
}