import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './books/book.module';
import { RoutingModule } from './routing/routing.module';

@Module({
    imports: [
        BookModule,
        RoutingModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
