import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { BookService } from '../services/book.service';
import { CreateBookDTO } from '../dto/create-book.dto';
import { Book } from '../models/book.model';
import { GetAllResponse } from '../../generic/services/generic-data.service';
import chalk from 'chalk';
import { GnRequest } from '../../generic/gn-request';

@Controller('books')
export class BookController {
    constructor(private booksService: BookService) { }

    @Get(':bookId')
    async getBook(@Param('bookId') bookId, @Query() params) {
        console.log(chalk.green('bookId '), bookId);
        const book = await this.booksService.getOne(bookId, params);
        return book;
    }

    @Get(':bookId/light-book-editor')
    async getLightBookEditor(@Param('bookId') bookId) {
        const book = await this.booksService.getLightBookEditor(bookId);
        return book;
    }

    @Get()
    async getBooks(@Query() params): Promise<GetAllResponse<Book> | Book[]> {
        let books = [];
        if (params && params.pSize) {
            books = await this.booksService.getAllWithPagination(params);
        } else {
            books = await this.booksService.getAll(params);
        }
        return books;
    }

    @Get(':bookId/categories')
    async getCategories(@Query() params: GnRequest): Promise<string[]> {
        console.log(chalk.green.bold('getCategories '));
        const categories = await this.booksService.getCategories(params);
        return categories;
    }


    @Get(':bookId/codes')
    async getCodes(@Query() params: GnRequest): Promise<number[]> {
        console.log(chalk.yellow.bold('getCodes '));
        const codes = await this.booksService.getCodes(params);
        return codes;
    }


    @Get(':bookId/booleans')
    async getBooleans(@Query() params: GnRequest): Promise<boolean[]> {
        console.log(chalk.blue.bold('getBooleans '));
        const codes = await this.booksService.getBooleans(params);
        return codes;
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
