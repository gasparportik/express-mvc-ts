/// <reference path="index.ts" />
import { Express, Router, Request, Response } from 'express';
import {RouteMetadata} from './annotations';

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
                    route.handler.call(this);
                    this.request = null;
                    this.response = null;
                });
            });
        }
    }
    protected view(): void;
    protected view(viewName: string): void;
    protected view(modelData: Object): void;
    protected view(viewName?: string | Object, modelData?: Object): void {
        if (typeof viewName === 'object') {
            modelData = viewName;
            viewName = undefined;
        }
        if (viewName === undefined) {
            viewName = this.request.route.path.substr(1);
        }
        this.response.render(this.name + '/' + (<string>viewName), modelData);
    }

    protected json(data: any) {
        this.response.json(data);
    }

    public get Router() {
        return this.router;
    }

    public get Name() {
        return this.name;
    }
}
