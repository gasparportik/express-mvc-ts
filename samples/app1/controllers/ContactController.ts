import { Controller, Inject, Request, Response, HttpGet, HttpPost, FromBody, FromForm } from 'express-mvc-ts';
import ContactRequestDataStore from '../services/ContactRequestDataStore';
import Logger from '../services/Logger';

@Inject
export class ContactController extends Controller {

    public constructor(private logger: Logger, private contacts: ContactRequestDataStore) {
        super();
    }

    @HttpGet
    public index() {
        return this.view();
    }

    @HttpPost
    public indexPost( @FromForm name?: string, @FromForm email?: string, @FromForm message?: string) {
        var model = { name, email, message, errors: [] };
        if (!model.name) {
            model.errors.push('Please specify your name!');
        }
        if (!model.email) {
            model.errors.push('Please specify your email!');
        }
        if (!model.message) {
            model.errors.push('You forgot the message dummy!');
        }
        if (model.errors.length > 0) {
            return this.view(model);
        }
        return this.contacts.saveContactRequest(model)
            .catch((err) => {
                this.logger.error(err);
                model.errors.push('Oops! Some Hideous Interruptive Trouble happened.');
            })
            .then(() => model.errors.length > 0 ? this.view(model) : this.redirect('/contact/success'));
    }

    @HttpGet
    public success() {
        return this.view('success');
    }

}