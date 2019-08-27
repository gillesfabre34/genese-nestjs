import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { BookService } from '../services/book.service';
import { CreateBookDTO } from '../dto/create-book.dto';
import { Book } from '../models/book.model';
import { GetAllResponse } from '../../generic/services/generic-data.service';

const chalk = require('chalk');

@Controller('books')
export class BookController {
    constructor(private booksService: BookService) { }

    @Get()
    async getBooks(@Query() params): Promise<GetAllResponse<Book>> {
        console.log(chalk.blue('getBooks JSON.stringify(params) : ', JSON.stringify((params))));
        const books = await this.booksService.getAll(params);
        return books;
    }

    @Get()
    async getDataExtractedFromBooks(@Query() params): Promise<GetAllResponse<Book>> {
        console.log(chalk.blue('getBooks JSON.stringify(params) : ', JSON.stringify((params))));
        const books = await this.booksService.getDataExtracted(params);
        return books;
    }

    @Get(':bookId')
    async getBook(@Param('bookId') bookId, @Query() params) {
        console.log(chalk.green('getBook bookId : ', bookId));
        console.log(chalk.green('getBook params : ', params));
        console.log(chalk.blue.bold('getBook params : ', JSON.stringify(params)));
        const book = await this.booksService.getOne(bookId, params);
        console.log(chalk.green('getBook JSON.stringify(book) : ', JSON.stringify(book)));
        return book;
    }

    @Get(':bookId/light-book-editor')
    async getLightBookEditor(@Param('bookId') bookId) {
        // console.log(chalk.magenta('lightbookeditor bookId : ', bookId));
        const book = await this.booksService.getLightBookEditor(bookId);
        return book;
    }

    @Post()
    async addBook(@Body() createBookDTO: CreateBookDTO) {
        const book = await this.booksService.addBook(createBookDTO);
        return book;
    }

    @Delete(':bookId')
    async deleteBook(@Param('bookId') bookId) {
        console.log(chalk.magenta.bold('deleteBook bookId : ', bookId));
        const books = await this.booksService.deleteBook(bookId);
        return books;
    }
}
