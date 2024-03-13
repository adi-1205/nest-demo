import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    DatabaseModule,
    TodosModule,
    AuthModule,
    MailModule,
  ],
  controllers:[AppController]
})
export class AppModule { }
