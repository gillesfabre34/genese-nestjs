import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { BookService } from '../services/book.service';
import { CreateBookDTO } from '../dto/create-book.dto';
import { Book } from '../models/book.model';
import { GetAllResponse } from '../../generic/services/generic-data.service';
import chalk from 'chalk';
import { GeneseMapper } from 'genese-mapper';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BookController {

    private geneseMapperService: GeneseMapper<Book>;

    constructor(private booksService: BookService) {
        this.geneseMapperService = new GeneseMapper(Book);
    }

    @Get(':bookId')
    @ApiOperation({ summary: 'Get one book' })
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: Book,
    })
    async getBook(@Param('bookId') bookId: string, @Query() params) {
        console.log(chalk.green('bookId '), bookId);
        const book = await this.booksService.getOne(bookId, params);
        return book;
    }

    @Get()
    @ApiOperation({ summary: 'Get all books' })
    async getBooks(@Query() params): Promise<GetAllResponse<Book> | Book[]> {
        let books = [];
        if (params && params.pSize) {
            books = await this.booksService.getAllWithPagination(params);
        } else {
            books = await this.booksService.getAll(params);
        }
        return books;
    }


    @Post()
    @ApiOperation({ summary: 'Create a book' })
    async addBook(@Body() createBookDTO: CreateBookDTO) {
        const book = await this.booksService.addBook(createBookDTO);
        return book;
    }

    @Delete(':bookId')
    @ApiOperation({ summary: 'Delete a book' })
    async deleteBook(@Param('bookId') bookId) {
        const books = await this.booksService.deleteBook(bookId);
        return books;
    }
}
