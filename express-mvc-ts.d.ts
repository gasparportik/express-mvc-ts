declare module 'express-mvc-ts' {
    // begin module
    import * as express from 'express';
    export namespace MetadataSymbols {
        const ControllerRoutesSymbol: symbol;
        const ControllerRoutePrefixSymbol: symbol;
        const ControllerRouteParamsSymbol: symbol;
        const DependencyInjectionTypesSymbol: symbol;
        const DependencyServiceTypeSymbol: symbol;
    }
    export interface RouteMetadata {
        method: string;
        route: string;
        name: string;
        handler: Function;
    }
    export function HttpGet(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    export function HttpGet(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    export function HttpPost(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    export function HttpPost(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    export function HttpPut(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    export function HttpPut(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    export function HttpPatch(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    export function HttpPatch(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    export function HttpDelete(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    export function HttpDelete(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    export function HttpOptions(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    export function HttpOptions(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    export function HttpHead(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    export function HttpHead(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    export function Route<TFunction extends Function>(route?: string): (target: TFunction) => any;
    export function Route<TFunction extends Function>(target: TFunction): any;
    export function Route(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    export function Route(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    export interface RouteParameterMetadata {
        index: number;
        kind: string;
        name?: string;
        type: any;
    }
    export function FromBody(name?: string): (target: Object, propertyKey: string, parameterIndex: number) => void;
    export function FromBody(target: Object, propertyKey: string, parameterIndex: number): void;
    export function FromForm(name?: string): (target: Object, propertyKey: string, parameterIndex: number) => void;
    export function FromForm(target: Object, propertyKey: string, parameterIndex: number): void;
    export function FromHeader(name?: string): (target: Object, propertyKey: string, parameterIndex: number) => void;
    export function FromHeader(target: Object, propertyKey: string, parameterIndex: number): void;
    export function FromQuery(name?: string): (target: Object, propertyKey: string, parameterIndex: number) => void;
    export function FromQuery(target: Object, propertyKey: string, parameterIndex: number): void;
    export function FromRoute(name?: string): (target: Object, propertyKey: string, parameterIndex: number) => void;
    export function FromRoute(target: Object, propertyKey: string, parameterIndex: number): void;
    export function Inject(target: Object): any;
    export function SingletonService(target: Object): any;
    export function TransientService(target: Object): any;



    export interface IController {
        router: express.Router;
    }
    export class Controller implements IController {
        router: express.Router;
        constructor();
        protected view(): Promise<ViewResult>;
        protected view(viewName: string): Promise<ViewResult>;
        protected view(modelData: Object): Promise<ViewResult>;
        protected view(viewName: string, modelData: Object): Promise<ViewResult>;
        protected redirect(url: string): Promise<RedirectResult>;
        protected json(data: any): Promise<JsonResult>;
        protected content(data: any): Promise<ContentResult>;
        protected file(data: any): Promise<FileContentResult>;
    }
    export interface ViewResult {
        type: "view";
        name: string;
        data: any;
    }
    export interface RedirectResult {
        type: "redirect";
        url: string;
    }
    export interface JsonResult {
        type: "json";
        data: any;
    }
    export interface ContentResult {
        type: "content";
        data: string;
    }
    export interface FileContentResult {
        type: "file";
        data: string;
    }
    export type RouteResult = ViewResult | JsonResult | RedirectResult | ContentResult | FileContentResult;
    export function handleResult(res: express.Response, result: RouteResult): void;
    export function getControllerName(controller: Function): string;

    export interface ConstructorFor<T> {
        new (...params: any[]): T;
    }
    export class DependencyManager {
        private instances;
        private getServiceInstance(type);
        getInstance<T>(ctor: ConstructorFor<T>): T;
    }
    export const dm: DependencyManager;










    export class MvcApp {
        controllers: ControllerInfo[];
        rootRouter: express.Router;
        dm: DependencyManager;
    }
    export interface ControllerInfo {
        name: string;
        type: ConstructorFor<IController>;
        instance?: IController;
    }
    export interface Request extends express.Request {
    }
    export class Request {
        constructor();
    }
    export interface Response extends express.Response {
    }
    export class Response {
        constructor();
    }
    export interface SetupOptions {
        controllerDir?: string;
        transientControllers?: boolean;
        singleRouterToApp?: boolean;
        dependencyManager?: DependencyManager;
        debugRoutes?: boolean;
    }
    export function setup(app: express.Express, options?: SetupOptions): MvcApp;

}