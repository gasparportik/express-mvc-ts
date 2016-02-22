/// <reference path="../express/express.d.ts" />
declare module 'express-mvc-ts' {
    import { Express, Router, Request, Response } from 'express';
    interface RouteMetadata {
        method: string;
        route: string;
        handler: Function;
    }
    class Controller {
        protected router: Router;
        protected request: Request;
        protected response: Response;
        protected name: string;
        constructor();
        protected view(): Promise<any>;
        protected view(viewName: string): Promise<any>;
        protected view(modelData: Object): Promise<any>;
        protected view(viewName: string, modelData: Object): Promise<any>;
        protected json(data: any): Promise<any>;
        protected redirect(url: string): Promise<any>;
        protected defer(): Promise<any>;
        Router: Router;
        Name: string;
    }
    
    function Inject(target: Object): any;
    function SingletonService(target: Object): any;
    function TransientService(target: Object): any;

    function HttpGet(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    function HttpPost(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    function HttpPut(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    function HttpPatch(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    function HttpDelete(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    function HttpOptions(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    function HttpHead(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    function HttpGet(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    function HttpPost(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    function HttpPut(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    function HttpPatch(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    function HttpDelete(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    function HttpOptions(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    function HttpHead(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    function Route(route?: string): (target: Object, propertyKey?: string, descriptor?: TypedPropertyDescriptor<any>) => any;
    interface SetupOptions {
        controllerDir?: string;
    }
    interface ControllerInfo {
        name: string;
        type: typeof Controller;
    }
    
    interface ConstructorFor<T> {
        new (...params: any[]): T;
    }
    
    class DependencyManager {
        private instances;
        private getServiceInstance(type);
        getInstance<T>(ctor: ConstructorFor<T>): T;
    }
    const dm: DependencyManager;
    function setup(app: Express, options?: SetupOptions): ControllerInfo[];
}