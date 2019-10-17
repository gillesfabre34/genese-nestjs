export class Book {

    public id: number;
    public author?: string;
    public categories?: string[];
    public description?: string;
    public title?: string;
    public irrelevantProperty?: string;
    public editor?: {
        name?: string,
        place: {
            city: string,
            country: string,
            street: string
        },
    };

    constructor() {}

}


export class LightBookEditor {
    name ?= 'editor.name';
    city ?= 'editor.place.city';
    country ?= 'editor.place.country';
    title ?= 'title';
}
