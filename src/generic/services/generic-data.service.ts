import { HttpException, Injectable, Query } from '@nestjs/common';
import { BOOKS } from '../../books/mocks/book.mock';
import chalk from 'chalk';
import { GnRequest } from '../gn-request';

@Injectable()
export abstract class GenericDataService<T> {
    books: unknown = BOOKS;


    getOne(id: string, @Query() query): Promise<T> {
        // console.log(chalk.magenta.bold('getOne query : ', JSON.stringify(query)));
        const dataFromDb = this.books as any[]; // TODO : link to real db
        return new Promise(resolve => {
            const book = dataFromDb.find(book => book.id === +id);
            if (!book) {
                throw new HttpException('Book does not exist!', 404);
            }
            const result = query && query.gnExtract ? this.extractFieldsFromData(book, query.gnExtract) : book;
            resolve(result);
        });
    }


<<<<<<< Updated upstream
    getAll(@Query() params): Promise<GetAllResponse<T>> {
=======
    /**
     * Get all elements
     * @param params
     */
    getAll(@Query() params: GnRequest): Promise<GetAllResponse<T>> {
>>>>>>> Stashed changes
        return new Promise(resolve => {
            let dataFromDb = this.books as T[]; // TODO : link to real db
            if (params && params.gnExtract) {
                dataFromDb = this.extractFieldsFromData(dataFromDb, JSON.parse(params.gnExtract.toString()));
            }
            const results = params && params.gnPage ? this.paginate<T>(dataFromDb, params) : this.books as T[];
            resolve({results, totalResults: dataFromDb.length});
        });
    }

    paginate<U = T>(data: U[], @Query() params): U[] {
        let results: U[] = [];
        if (Array.isArray(data) && params) {
            const limit = params.gnLimit && params.gnLimit > 0 ? params.gnLimit : 10;
            const nbPages = Math.round(data.length / limit) + 1;
            const page = params.gnPage && params.gnPage >= 0 && params.gnPage < nbPages ? params.gnPage : nbPages;
            results = data.slice(limit * page, limit * (page + 1));
        }
        return results;
    }


<<<<<<< Updated upstream
    getDataExtracted(@Query() params): Promise<any> {
        return new Promise(resolve => {
            let dataFromDb = this.books as T[]; // TODO : link to real db
            console.log(chalk.yellow.bold('getAll params : ', JSON.stringify(params)));
            console.log(chalk.yellow.bold('getAll params.gExtract : ', JSON.parse(params.gExtract)));
            if (params && params.gExtract) {
                dataFromDb = this.extractFieldsFromData(dataFromDb, JSON.parse(params.gExtract));
            }
            const results = params && params.gPage ? this.paginate<T>(dataFromDb, params) : this.books as T[];
            resolve({results, totalResults: dataFromDb.length});
        });
    }


=======
    /**
     * Extract all the fields of some data corresponding to a given extraction model
     * @param data
     * @param extractionModel
     */
>>>>>>> Stashed changes
    extractFieldsFromData(data: any, extractionModel: string): any {
        // console.log(chalk.cyan.bold('extractFieldsFromData extractionModel'), extractionModel);
        // console.log(chalk.cyan.bold('extractFieldsFromData data'), data);
        if (!extractionModel) {
            return data;
        }
        const parsedModel = JSON.parse(extractionModel);
        console.log(chalk.cyan.bold('extractFieldsFromData parsedModel'), parsedModel);
        const result = {};
        for (const key of Object.keys(parsedModel)) {
            // console.log(chalk.cyan.bold('extractFieldsFromData key'), key);
            Object.assign(result, {[key]: this.extractFieldsForOneProperty(data, key, parsedModel[key])});
            // console.log(chalk.cyan.bold('extractFieldsFromData result'), result);
        }
        return result;
    }

    extractFieldsForOneProperty(data: any, key: string, pathExtraction: string): object {
        const extracts = [];
        if (Array.isArray(data)) {
            for (const element of data) {
                extracts.push(this.extractFieldsForOneProperty(element, key, pathExtraction));
            }
        } else {
            // console.log(chalk.green.bold('extractFieldsForOneProperty key'), key);
            // console.log(chalk.green.bold('extractFieldsForOneProperty data[key]'), data[key]);
            // console.log(chalk.green.bold('extractFieldsForOneProperty pathExtraction'), pathExtraction);
            const value = this.extractValue(data, key, pathExtraction);
            console.log(chalk.green.bold('extractFieldsForOneProperty value'), value);
            return value;
        }
        return extracts;
    }


    extractValue(data: any, key: string, path: string): any {
        if (!data || !path) {
            return data;
        }
        const branches: string[] = path.split('.');
        let value;
        for (const branch of branches) {
            console.log(chalk.green.bold('extractValue branch'), branch);
            if (!value) {
                value = data[branch];
            } else {
                value = value[branch];
            }
        }
        return value;
    }
}

export interface GetAllResponse<T> {
    results: T[];
    totalResults: number;
}
