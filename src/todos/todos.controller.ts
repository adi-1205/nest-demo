import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, DefaultValuePipe, UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';

@Controller('todos')
@UseGuards(AuthGuard())
export class TodosController {
  constructor(private readonly todosService: TodosService) {}
  
  @Post()
  @UsePipes(ValidationPipe)
  @Roles(Role.Admin)
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

}
