import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { BookService } from '../services/book.service';
import { CreateBookDTO } from '../dto/create-book.dto';
import { Book } from '../models/book.model';
import { GetAllResponse } from '../../generic/services/generic-data.service';

@Controller('books')
export class BookController {
    constructor(private booksService: BookService) { }

    @Get(':bookId')
    async getBook(@Param('bookId') bookId, @Query() params) {
        if (bookId === 'authors') {
            const authors: string[] = await this.booksService.getAuthors();
            return authors;
        } else {
            const book = await this.booksService.getOne(bookId, params);
            return book;
        }
    }

    @Get(':bookId/light-book-editor')
    async getLightBookEditor(@Param('bookId') bookId) {
        const book = await this.booksService.getLightBookEditor(bookId);
        return book;
    }

    @Get()
    async getBooks(@Query() params): Promise<GetAllResponse<Book>> {
        const books = await this.booksService.getAll(params);
        return books;
    }


    @Post()
    async addBook(@Body() createBookDTO: CreateBookDTO) {
        const book = await this.booksService.addBook(createBookDTO);
        return book;
    }

    @Delete(':bookId')
    async deleteBook(@Param('bookId') bookId) {
        const books = await this.booksService.deleteBook(bookId);
        return books;
    }
}
