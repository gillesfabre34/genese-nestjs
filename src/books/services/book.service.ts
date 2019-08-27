import { HttpException, Injectable } from '@nestjs/common';
import { BOOKS } from '../mocks/book.mock';
import { Book } from '../models/book.model';
import { GenericDataService } from '../../generic/services/generic-data.service';
import chalk from 'chalk';

@Injectable()
export class BookService extends GenericDataService<Book> {
    books = BOOKS;


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

    addBook(book): Promise<any> {
        console.log('addBook book', book);
        return new Promise(resolve => {
            console.log('addBook resolve', resolve);
            this.books.push(book);
            resolve(this.books);
        });
    }

    deleteBook(bookID): Promise<any> {
        console.log(chalk.greenBright.bold('deleteBook bookID : ', bookID));
        const id = Number(bookID);
        return new Promise(resolve => {
            const index = this.books.findIndex(book => book.id === id);
            if (index === -1) {
                throw new HttpException('Book does not exist!', 404);
            }
            this.books.splice(index, 1);
            // console.log(chalk.greenBright.bold('deleteBook this.books.length', this.books.length.toString()));
            resolve(this.books);
        });
    }
}

