import { Controller, Inject, Route, HttpGet, HttpPost, FromHeader } from 'express-mvc-ts';
import { MyRefererDataService } from '../services/refererServices';

@Inject
@Route('')
export class HomeController extends Controller {

    @HttpGet
    public index(referer: string, refererService: MyRefererDataService) {
        refererService.saveReferer(referer);
        return this.view();
    }

    @HttpGet
    public about( @FromHeader('Content-Type') contentType: string) {
        if (contentType === 'application/json') {
            return this.json({ description: "This is my site." });
        } else {
            return this.view('about');
        }
    }
}

@Inject
export class ContactController extends Controller {

    public constructor(private dataStore: MyCoolDataStoreService) {
        super();
    }

    @HttpGet('form(/:reason)?')
    public form(reason: string) {
        return this.view('contact', { reason });
    }

    @HttpPost('api/save')
    public save( @FromBody contactRequest: IContactRequest) {
        return this.dataStore.saveContactRequest(contactRequest)
            .then((response) => this.json({ success: true, response }))
            .catch(() => this.json({ success: false }));
    }
}