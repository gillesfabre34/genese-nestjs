import { HttpException, Injectable, Query } from '@nestjs/common';
import { BOOKS } from '../../books/mocks/book.mock';
import chalk from 'chalk';

@Injectable()
export abstract class GenericDataService<T> {
    books: unknown = BOOKS;


    /**
     * Get one element
     * @param id
     * @param query
     */
    getOne(id: string, @Query() query): Promise<T> {
        const dataFromDb = this.books as any[]; // TODO : link to real db
        return new Promise(resolve => {
            const book = dataFromDb.find(book => book.id === +id);
            if (!book) {
                throw new HttpException('Book does not exist!', 404);
            }
            const result = query && query.gExtract ? this.extractFieldsFromData(book, query.gExtract) : book;
            resolve(result);
        });
    }


    /**
     * Get all elements
     * @param params
     */
    getAll(@Query() params): Promise<GetAllResponse<T>> {
        return new Promise(resolve => {
            let dataFromDb = this.books as T[]; // TODO : link to real db
            if (params && params.gExtract) {
                dataFromDb = this.extractFieldsFromData(dataFromDb, JSON.parse(params.gExtract));
            }
            const results = params && params.gPage ? this.paginate<T>(dataFromDb, params) : this.books as T[];
            resolve({results, totalResults: dataFromDb.length});
        });
    }


    /**
     * Paginate results
     * @param data
     * @param params
     */
    paginate<U = T>(data: U[], @Query() params): U[] {
        let results: U[] = [];
        if (Array.isArray(data) && params) {
            const limit = params.gLimit && params.gLimit > 0 ? params.gLimit : 10;
            const nbPages = Math.round(data.length / limit) + 1;
            const page = params.gPage && params.gPage >= 0 && params.gPage < nbPages ? params.gPage : nbPages;
            results = data.slice(limit * page, limit * (page + 1));
        }
        return results;
    }


    /**
     * Return fields extracted from data with gnExtract param
     * @param params
     */
    getDataExtracted(@Query() params): Promise<any> {
        return new Promise(resolve => {
            let dataFromDb = this.books as T[]; // TODO : link to real db
            if (params && params.gExtract) {
                dataFromDb = this.extractFieldsFromData(dataFromDb, JSON.parse(params.gExtract));
            }
            const results = params && params.gPage ? this.paginate<T>(dataFromDb, params) : this.books as T[];
            resolve({results, totalResults: dataFromDb.length});
        });
    }



    /**
     * Extract all the fields of some data corresponding to a given extraction model
     * @param data
     * @param extractionModel
     */
    extractFieldsFromData(data: any, extractionModel: string): any {
        if (!extractionModel) {
            return data;
        }
        const parsedModel = JSON.parse(extractionModel);
        console.log(chalk.cyan.bold('extractFieldsFromData parsedModel'), parsedModel);
        const result = {};
        for (const key of Object.keys(parsedModel)) {
            Object.assign(result, {[key]: this.extractFieldsForOneProperty(data, key, parsedModel[key])});
        }
        return result;
    }

    /**
     * For a given key of an extraction model and with the path corresponding of this key,
     * returns the fields from data which have the same key for the same path
     * @param data
     * @param key
     * @param pathExtraction
     */
    extractFieldsForOneProperty(data: any, key: string, pathExtraction: string): object {
        const extracts = [];
        if (Array.isArray(data)) {
            for (const element of data) {
                extracts.push(this.extractFieldsForOneProperty(element, key, pathExtraction));
            }
        } else {
            const value = this.extractValue(data, key, pathExtraction);
            return value;
        }
        return extracts;
    }


    /**
     * With a given key and a given path, extracts the value of a data object for this key and this path
     * @param data
     * @param key
     * @param path
     */
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

/**
 * Interface for paginated results
 */
export interface GetAllResponse<T> {
    results: T[];
    totalResults: number;
}
