import {IsEmail, IsNotEmpty} from 'class-validator';

export class LoginUserDto{

    @IsNotEmpty({message:'Email should not be empty'})
    @IsEmail()
    email: string

    @IsNotEmpty({message:"Password should not be empty"})
    password: string
}