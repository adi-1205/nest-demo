import { Inject, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Repository } from 'typeorm';
import { Todo } from 'src/database/entities/todos.entity';

@Injectable()
export class TodosService {

  constructor(@Inject('TODO_REPOSITORY') private readonly todo: Repository<Todo>) { }

  async create(createTodoDto: CreateTodoDto) {
    if (!createTodoDto.body)
      createTodoDto.body = createTodoDto.title
    let newTodo = new Todo(createTodoDto);
    let result = await this.todo.save(newTodo)
    return result;
  }

  async findAll() {
    let allTodos = await this.todo.find();

    return allTodos;
  }
}
