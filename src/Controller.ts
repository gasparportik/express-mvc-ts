/// <reference path="index.ts" />
import { Express, Router, Request, Response } from 'express';
import { RouteMetadata } from './annotations';

/**
 * Base class for MVC-like controllers
 */
export class Controller {

    protected router: Router;
    protected request: Request;
    protected response: Response;

    protected name: string;

    public constructor() {
        let proto: any = (<Object>this).constructor;
        this.name = (<string>proto.name).replace('Controller', '').toLowerCase();
        this.router = Router();
        let routes: RouteMetadata[] = Reflect.getMetadata("controller:routes", this);
        if (routes) {
            routes.forEach(route => {
                let method: Function = (<any>this.router)[route.method];
                method.call(this.router, '/' + route.route, (req: Request, res: Response) => {
                    this.request = req;
                    this.response = res;
                    var resultPromise = route.handler.call(this);
                    this.request = null;
                    this.response = null;
                    if (resultPromise && typeof resultPromise.then === 'function') {
                        resultPromise.then((result: any) => this.handleResult(res, result));
                    }
                });
            });
        }
    }

    private handleResult(res: Response, result: { type: string, name?: string, data: any }) {
        switch (result.type) {
            case 'json':
                res.json(result.data);
                break;
            case 'view':
                res.render(result.name, result.data);
                break;
            case 'redirect':
                res.redirect(result.data);
                break;
            case 'text':
                res.end(result.data);
                break;
            default:
                res.end();
                break;
        }
    }

    protected view(): Promise<any>;
    protected view(viewName: string): Promise<any>;
    protected view(modelData: Object): Promise<any>;
    protected view(viewName: string, modelData: Object): Promise<any>;
    protected view(viewName?: string | Object, modelData?: Object): Promise<any> {
        if (typeof viewName === 'object') {
            modelData = viewName;
            viewName = undefined;
        }
        if (viewName === undefined) {
            viewName = 'index';
        }
        return Promise.resolve({ type: 'view', name: this.name + '/' + (<string>viewName), data: modelData });
    }
    
    protected redirect(url: string) {
        return Promise.resolve({ type: 'redirect', data: url });
    }

    protected defer() {
        var promise = new Promise((resolve) => {
            (<any>promise).json = this.json;
            (<any>promise).view = this.view;
        });
        return promise;
    }

    protected json(data: any) {
        return Promise.resolve({ type: 'json', data });
    }

    public get Router() {
        return this.router;
    }

    public get Name() {
        return this.name;
    }
}
