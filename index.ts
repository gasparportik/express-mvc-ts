import { Express, Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export interface RouteMetadata {
    method: string;
    route: string;
    handler: Function;
}
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
            routes.forEach(route => console.log(`${route.method} /${this.name}/${route.route}`));
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

    get Router() {
        return this.router;
    }

    get Name() {
        return this.name;
    }
}



function addRouteMetadata(target: Object, method: string, route: string, handler: Function) {
    let existingData: RouteMetadata[] = Reflect.getMetadata("controller:routes", target);
    if (existingData === undefined) {
        existingData = [];
    }
    existingData.push({ method, route: route.replace(new RegExp(method, 'i'), ''), handler });

    Reflect.defineMetadata("controller:routes", existingData, target);
}

export function HttpGet(route?: string) {
    return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target, "get", route ? route : propertyKey, descriptor.value);
        return descriptor;
    }
}

export function HttpPost(route?: string) {
    return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target, "post", route ? route : propertyKey, descriptor.value);
        return descriptor;
    }
}

export function HttpPut(route?: string) {
    return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target, "put", route ? route : propertyKey, descriptor.value);
        return descriptor;
    }
}

export function HttpPatch(route?: string) {
    return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target, "patch", route ? route : propertyKey, descriptor.value);
        return descriptor;
    }
}

export function HttpDelete(route?: string) {
    return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target, "delete", route ? route : propertyKey, descriptor.value);
        return descriptor;
    }
}

export function HttpOptions(route?: string) {
    return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target, "options", route ? route : propertyKey, descriptor.value);
        return descriptor;
    }
}

export function HttpHead(route?: string) {
    return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target, "head", route ? route : propertyKey, descriptor.value);
        return descriptor;
    }
}

export function Route(route?: string) {
    return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target, "all", route ? route : propertyKey, descriptor.value);
        return descriptor;
    }
}

interface SetupOptions {
    controllerDir?: string;

}

export function setup(app: Express, options: SetupOptions = {}) {
    if (!options.controllerDir) {
        options.controllerDir = path.join(process.cwd(), 'controllers');
    }
    fs.readdir(options.controllerDir, (err, files) => {
        if (err) {
            return;
        }
        var re = /[A-Za-z0-9]+Controller\.js$/;
        files.filter(file => re.test(file)).forEach(file => {
            let module = require(path.join(options.controllerDir, file));
            let controller: Controller = new module[file.replace('.js', '')];
            app.use('/' + controller.Name, controller.Router);
        });
    });

}