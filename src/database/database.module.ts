import { Global, Module } from '@nestjs/common';
import { dataSource } from './database.service';
import { DataSource } from 'typeorm';
import { Todo } from './entities/todos.entity'
import { User } from './entities/user.entity';

@Global()
@Module({
    providers: [
        {
            provide: 'DATA_SOURCE',
            useFactory: async () => {
                return dataSource.initialize();
            },
        },
        {
            provide: 'TODO_REPOSITORY',
            useFactory: (dataSource: DataSource) => dataSource.getRepository(Todo),
            inject: ['DATA_SOURCE'],
        },
        {
            provide: 'USER_REPOSITORY',
            useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
            inject: ['DATA_SOURCE'],
        },
    ],
    exports: [
        {
            provide: 'DATA_SOURCE',
            useFactory: async () => {
                return dataSource.initialize();
            },
        },
        {
            provide: 'TODO_REPOSITORY',
            useFactory: (dataSource: DataSource) => dataSource.getRepository(Todo),
            inject: ['DATA_SOURCE'],
        },
        {
            provide: 'USER_REPOSITORY',
            useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
            inject: ['DATA_SOURCE'],
        },
    ],
})
export class DatabaseModule { }