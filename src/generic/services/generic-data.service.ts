import { HttpException, Injectable, Query } from '@nestjs/common';
import { BOOKS } from '../../books/mocks/book.mock';
import chalk from 'chalk';
import { GnRequest } from '../gn-request';
import { of } from 'rxjs';

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
            const result = query && query.gnExtract ? this.extractFieldsFromData(book, query.gnExtract) : book;
            resolve(result);
        });
    }


    /**
     * Get all elements
     * @param params
     */
    getAll(@Query() params: GnRequest): Promise<any> {
        return new Promise(resolve => {
            let dataFromDb = this.books as T[]; // TODO : link to real db
            if (params && params.gnExtract) {
                dataFromDb = this.extractFieldsFromData(dataFromDb, JSON.parse(params.gnExtract.toString()));
            }
            resolve(dataFromDb);
        });
    }


    /**
     * Get all elements with pagination
     * @param params
     */
    getAllWithPagination(@Query() params: any): Promise<any> {
        if (!params || !params.pSize) {
            console.error(chalk.red('Incorrect parameters for pagination'), JSON.stringify(params));
            return of(undefined).toPromise();
        }
        return new Promise(resolve => {
            let dataFromDb = this.books as T[]; // TODO : link to real db
            if (params.gnExtract) {
                dataFromDb = this.extractFieldsFromData(dataFromDb, JSON.parse(params.gnExtract.toString()));
            }
            const results = this.paginate<T>(dataFromDb, params.pSize, params.pIndex);
            resolve({data: results, total: dataFromDb.length});
        });
    }


    /**
     * Paginate results
     * @param data
     * @param pageSize
     * @param pageIndex
     */
    paginate<U = T>(data: U[], pageSize: number, pageIndex: number = 0): U[] {
        let results: U[] = [];
        pageIndex = Number(pageIndex);
        pageSize = Number(pageSize);
        if (Array.isArray(data) && pageSize) {
            pageSize = pageSize > 0 ? pageSize : 10;
            const nbPages = Math.round(data.length / pageSize) + 1;
            pageIndex = pageIndex >= 0 && pageIndex < nbPages ? pageIndex : nbPages;
            results = data.slice(pageSize * pageIndex, pageSize * (pageIndex + 1));
        }
        return results;
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
