import {IsEmail, IsNotEmpty} from 'class-validator';

export class CreateUserDto{
    
    
    @IsNotEmpty({message:"Username should not be empty"})
    username: string

    @IsNotEmpty({message:'Email should not be empty'})
    @IsEmail()
    email: string

    @IsNotEmpty({message:"Password should not be empty"})
    password: string
}