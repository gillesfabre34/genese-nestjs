import { HttpException, Injectable, Query } from '@nestjs/common';
import { BOOKS } from '../mocks/book.mock';
import { Book } from '../models/book.model';
import { GenericDataService, GetAllResponse } from '../../generic/services/generic-data.service';
import chalk from 'chalk';
import { GnRequest } from '../../generic/gn-request';

@Injectable()
export class BookService extends GenericDataService<Book> {
    books = BOOKS;

    /**
     * Returns the edition field of a book with a "classic" route ':bookId/light-book-editor'
     * @param bookID
     */
    getLightBookEditor(bookID): Promise<any> {
        const id = Number(bookID);
        return new Promise(resolve => {
            const book = this.books.filter(book => book.id === id);
            if (!book) {
                throw new HttpException('Book does not exist!', 404);
            }
            const lightBook = book.map(e => {
                return {
                    name: e.editor.name,
                    city: e.editor.place.city,
                    country: e.editor.place.country,
                    title: e.title
                };
            });
            resolve(lightBook[0]);
        });
    }


    /**
     * Returns the authors of all books
     * @param params
     */
    getCategories(@Query() params: GnRequest): Promise<string[]> {
        return new Promise(resolve => {
            resolve(this.books[0].categories);
        });
    }


    /**
     * Returns the authors of all books
     * @param params
     */
    getBooleans(@Query() params: GnRequest): Promise<boolean[]> {
        return new Promise(resolve => {
            resolve(this.books[0].booleans);
        });
    }


    /**
     * Returns the authors of all books
     * @param params
     */
    getCodes(@Query() params: GnRequest): Promise<number[]> {
        return new Promise(resolve => {
            resolve(this.books[0].codes);
        });
    }


    /**
     * Create a new book
     * @param book
     */
    addBook(book): Promise<any> {
        console.log('addBook book', book);
        return new Promise(resolve => {
            console.log('addBook resolve', resolve);
            this.books.push(book);
            resolve(this.books);
        });
    }


    /**
     * Delete a book
     * @param bookID
     */
    deleteBook(bookID): Promise<any> {
        console.log(chalk.greenBright.bold('deleteBook bookID : ', bookID));
        const id = Number(bookID);
        return new Promise(resolve => {
            const index = this.books.findIndex(book => book.id === id);
            if (index === -1) {
                throw new HttpException('Book does not exist!', 404);
            }
            this.books.splice(index, 1);
            resolve(this.books);
        });
    }
}

