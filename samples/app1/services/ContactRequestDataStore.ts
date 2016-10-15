import CsvDataStore from './CsvDataStore';
import { SingletonService } from 'express-mvc-ts';

@SingletonService
export default class ContactRequestDataStore extends CsvDataStore {

    public constructor() {
        super("./contacts.csv", { headers: ["name", "email", "message"] });
    }

    public saveContactRequest(contact: any): Promise<any> {
        this.stream.write(contact);
        return Promise.resolve(true);
    }
}