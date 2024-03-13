import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, Post, Query, Redirect, Render, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('register')
  @Render('auth/register')
  async getRegister() {
    return
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() createUserDto: CreateUserDto) {
    let result = await this.authService.register(createUserDto)
    return result
  }

  @Get('check-email')
  @Render('auth/check-email')
  checkEmail() {
    return
  }

  @Get('verify')
  async verify(@Query() qr, @Res({ passthrough: true }) res: Response) {
    if (await this.authService.verify(qr)) {
      return res.redirect('/auth/login')
    } else {
      throw new BadRequestException('Invalid verification details')
    }
  }

  @Get('login')
  @Render('auth/login')
  async getLogin() {
    return
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request
  ) {

    let result = await this.authService.login(loginUserDto)
    res.cookie('auth', result.token)
    req.session['user'] = result.user
    return {success:true}

  }

  @Get('users')
  @UseGuards(AuthGuard())
  async findAll() {
    return await this.authService.findAll()
  }

  @Get('del')
  async del() {
    return await this.authService.del()
  }
}
