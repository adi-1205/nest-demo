import { IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class CreateTodoDto {
    
    @IsString()
    @IsNotEmpty({message:"Title should not be empty"})
    title: string
    
    @IsString()
    @IsOptional()
    body: string
}
