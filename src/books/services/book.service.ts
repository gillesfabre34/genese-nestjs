import { HttpException, Injectable } from '@nestjs/common';
import { BOOKS } from '../mocks/book.mock';
import { Book } from '../models/book.model';
import { GenericDataService } from '../../generic/services/generic-data.service';
import chalk from 'chalk';

@Injectable()
export class BookService extends GenericDataService<Book> {
    books = BOOKS;


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

