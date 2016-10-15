import {SingletonService} from 'express-mvc-ts';

@SingletonService
export default class RefererDataStore {
    public constructor() { }

    public getRefererByCode(code: string): Promise<any> {
        if (code === 'abc123') {
            return Promise.resolve({ name: 'Johnny Doey' });
        }
        return Promise.reject('Not found');
    }
}