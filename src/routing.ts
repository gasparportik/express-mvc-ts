import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { RouteMetadata, RouteParameterMetadata, MetadataSymbols } from './annotations.g';
import { dm, DependencyManager, ConstructorFor } from './dependency';
import { IController, handleResult, getControllerName } from './controller';

export class MvcApp {
    public controllers: ControllerInfo[];
    public rootRouter: express.Router;
    public dm: DependencyManager;
}

export interface ControllerInfo {
    name: string;
    type: ConstructorFor<IController>;
    instance?: IController;
}

export interface Request extends express.Request { }
export class Request { constructor() { } }
export interface Response extends express.Response { }
export class Response { constructor() { } }

namespace routing {

    type ParamFunction = (req: express.Request, res: express.Response, dm: DependencyManager) => string[];

    function getParamNames(func: Function): string[] {
        let code = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
        var result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);
        if (result !== null) {
            return Array.prototype.slice.call(result);
        }
        return [];
    }


    function createParamFunction(route: RouteMetadata, controllerClass: ConstructorFor<any>): ParamFunction | null {
        let paramTypes: any[] = Reflect.getMetadata("design:paramtypes", controllerClass.prototype, route.name);
        let paramAnnotations: RouteParameterMetadata[] = [];
        let params: RouteParameterMetadata[] = Reflect.getMetadata(MetadataSymbols.ControllerRouteParamsSymbol, controllerClass.prototype, route.name);
        if (params) {
            params.forEach(p => paramAnnotations[p.index] = p);
        }
        if (paramTypes && paramTypes.length) {
            let paramNames = getParamNames(route.handler);
            let args: string[] = paramTypes.map((p, i) => {
                if (p === Request) {
                    return 'req';
                }
                if (p === Response) {
                    return 'res';
                }
                let prefix = p === Number ? '+' : p === Boolean ? '!!' : '';
                if (paramAnnotations[i]) {
                    let name = paramAnnotations[i].name || paramNames[i];
                    switch (paramAnnotations[i].kind) {
                        case 'body':
                            return `req.body`;
                        case 'form':
                            return `req.body && ${prefix}req.body['${name}']`;
                        case 'header':
                            return `${prefix}req.get('${name}')`;
                        case 'query':
                            return `${prefix}req.query['${name}']`;
                        case 'route':
                            return `${prefix}req.params['${name}']`;
                        case 'null':
                        default:
                            return 'null'
                    }
                }
                if (typeof p === 'function' && [Number, String, Boolean, Array].indexOf(p) < 0) {
                    return `dm.getInstance(${p.name})`;
                }
                return `req.params['${paramNames[i]}'] !== undefined ? ${prefix}req.params['${paramNames[i]}'] : ${prefix}req.query['${paramNames[i]}']`;
            });
            return new Function('req', 'res', 'dm', `return [${args.join(', ')}]`) as any;
        }
        return null;
    }

    function setRoutesSingleton<T>(controllerClass: ConstructorFor<T>, router: express.Router, dm: DependencyManager, debug: boolean): T {
        let controller: T;
        controller = dm.getInstance(controllerClass);
        let routes: RouteMetadata[] = Reflect.getMetadata(MetadataSymbols.ControllerRoutesSymbol, controllerClass);
        if (!routes) {
            return controller;
        }
        routes.forEach(route => {
            let method: Function = (router as any)[route.method];
            let paramFunc: Function | null = createParamFunction(route, controllerClass);
            if (debug) {
                console.log(`  |- ${route.method} /${route.route}`);
            }
            method.call(router, '/' + route.route, (req: express.Request, res: express.Response) => {
                var resultPromise = paramFunc ? route.handler.apply(controller, paramFunc(req, res, dm)) : route.handler.call(controller);
                if (resultPromise && typeof resultPromise.then === 'function') {
                    resultPromise.then((result: any) => handleResult(res, result));
                }
            });
        });
        return controller;
    }

    function setRoutesTransient<T>(controllerClass: ConstructorFor<T>, router: express.Router, dm: DependencyManager, debug: boolean): void {
        let routes: RouteMetadata[] = Reflect.getMetadata("controller:routes", controllerClass);
        if (!routes) {
            return;
        }
        routes.forEach(route => {
            let method: Function = (router as any)[route.method];
            method.call(router, '/' + route.route, (req: express.Request, res: express.Response) => {
                let controller = dm.getInstance(controllerClass);
                var resultPromise = route.handler.call(controller);
                if (resultPromise && typeof resultPromise.then === 'function') {
                    resultPromise.then((result: any) => handleResult(res, result));
                }
            });
        });
    }
    const controllerFileMatcher = /([A-Za-z0-9]+)Controller\.js$/;

    export function setup(app: express.Express, options: SetupOptions = {}): MvcApp {
        let controllerDir = options.controllerDir || path.join(process.cwd(), 'controllers');
        let files = fs.readdirSync(controllerDir);
        let dependencyManager = options.dependencyManager || dm;
        let mvcApp = new MvcApp();
        mvcApp.rootRouter = options.singleRouterToApp ? express.Router() : app;
        mvcApp.controllers = files.filter(file => controllerFileMatcher.test(file)).map(file => {
            let module = require(path.join(controllerDir, file));
            let controllerClass: ConstructorFor<IController> = module[file.replace(/.js/, '')];
            let route: string = Reflect.getMetadata(MetadataSymbols.ControllerRoutePrefixSymbol, controllerClass);
            if (route === undefined) {
                route = getControllerName(controllerClass);
            }
            if (options.debugRoutes) {
                console.log(`  + ${route}`);
            }
            let router = express.Router();
            let controllerInstance: IController | undefined = undefined;
            if (options.transientControllers) {
                setRoutesTransient(controllerClass, router, dependencyManager, options.debugRoutes || false);
            } else {
                setRoutesSingleton(controllerClass, router, dependencyManager, options.debugRoutes || false);
            }
            mvcApp.rootRouter.use('/' + route, router);
            return { name: controllerFileMatcher.exec(file) ![1], type: controllerClass, instance: controllerInstance };
        });

        return mvcApp;
    }
    //not developed yet
    function setupLazy(app: express.Express, options: SetupOptions = {}): MvcApp {
        let controllerDir = options.controllerDir || path.join(process.cwd(), 'controllers');
        let dependencyManager = options.dependencyManager || dm;
        let mvcApp = new MvcApp();
        mvcApp.rootRouter = options.singleRouterToApp ? express.Router() : app;
        app.use(function (req, res, next) {
            var name = req.url.split(/\//, 2)[1] || 'index';
            let files = fs.readdirSync(controllerDir);
            var re = new RegExp(name + 'Controller\.js$', 'i');
            var file = files.filter(file => re.test(file))[0];
            let module = require(path.join(controllerDir, file));
            let controllerClass: ConstructorFor<any> = module[file.replace(/.js/, '')];
            let route: string = Reflect.getMetadata(MetadataSymbols.ControllerRoutePrefixSymbol, controllerClass) || getControllerName(controllerClass);
            if (options.debugRoutes) {
                console.log(`  + ${route}`);
            }
            let router = express.Router();
            if (options.transientControllers) {
                setRoutesTransient(controllerClass, router, dependencyManager, options.debugRoutes || false);
            } else {
                setRoutesSingleton(controllerClass, router, dependencyManager, options.debugRoutes || false);
            }
            app.use('/' + route, router);

        });
        return mvcApp;
    }

}

export interface SetupOptions {
    controllerDir?: string;
    transientControllers?: boolean;
    singleRouterToApp?: boolean;
    dependencyManager?: DependencyManager;
    debugRoutes?: boolean;
}

export function setup(app: express.Express, options: SetupOptions = {}): MvcApp {
    return routing.setup(app, options);
}


