import { Controller, Inject, Request, Route, HttpGet } from 'express-mvc-ts';
import RefererDataStore from '../services/RefererDataStore';
import Logger from '../services/Logger';

@Inject
@Route('')
export class HomeController extends Controller {

    public constructor(private logger: Logger, private referers: RefererDataStore) {
        super();
    }

    @HttpGet
    public index(refererCode?: string) {
        if (refererCode) {
            this.logger.fine("Looks like someone was referred to our site by this code: " + refererCode);
        }
        return Promise.resolve(refererCode ? this.referers.getRefererByCode(refererCode) : null)
            .then((referer: any) => this.view({ referer }))
            .catch(err => this.view());
    }

    @HttpGet
    public about(req: Request) {
        this.logger.debug("Client ip appears to be: " + req.ip);
        return this.view('about');
    }

}