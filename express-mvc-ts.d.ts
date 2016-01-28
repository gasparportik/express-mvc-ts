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
        protected view(): void;
        protected view(viewName: string): void;
        protected view(modelData: Object): void;
        protected json(data: any): void;
        Router: Router;
        Name: string;
    }
    function HttpGet(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    function HttpPost(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    function HttpPut(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    function HttpPatch(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    function HttpDelete(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    function HttpOptions(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    function HttpHead(route?: string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
    function Route(route?: string): (target: Object, propertyKey?: string, descriptor?: TypedPropertyDescriptor<any>) => any;
    interface SetupOptions {
        controllerDir?: string;
    }

    export function setup(app: Express, options?: SetupOptions);
}