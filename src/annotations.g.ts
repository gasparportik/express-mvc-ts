
export namespace MetadataSymbols {
    export const ControllerRoutesSymbol = Symbol.for("mvc:controller:routes");
    export const ControllerRoutePrefixSymbol = Symbol.for("mvc:controller:routePrefix");
    export const ControllerRouteParamsSymbol = Symbol.for("mvc:controller:route:params");
    export const DependencyInjectionTypesSymbol = Symbol.for("mvc:diTypes");
    export const DependencyServiceTypeSymbol = Symbol.for("mvc:serviceType");
}

export interface RouteMetadata {
    method: string;
    route: string;
    name: string;
    handler: Function;
}

function addRouteMetadata(target: Object, name: string, method: string, route: string, handler: Function) {
    let existingData: RouteMetadata[] = Reflect.getMetadata(MetadataSymbols.ControllerRoutesSymbol, target);
    if (existingData === undefined) {
        existingData = [];
    }
    existingData.push({ method, name, route: route === 'index' ? '' : route, handler });
    Reflect.defineMetadata(MetadataSymbols.ControllerRoutesSymbol, existingData, target);
}


export function HttpGet(route?: string) : (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
export function HttpGet(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>):TypedPropertyDescriptor<any>;
export function HttpGet(route?: Object, p1?: string, p2?: TypedPropertyDescriptor<any>) {
    let f = function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target.constructor, propertyKey, "get", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Get$/, '$1'), descriptor.value);
        return descriptor;
    };
    return typeof route === 'object' ? f.apply(undefined, arguments) : f;
}


export function HttpPost(route?: string) : (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
export function HttpPost(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>):TypedPropertyDescriptor<any>;
export function HttpPost(route?: Object, p1?: string, p2?: TypedPropertyDescriptor<any>) {
    let f = function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target.constructor, propertyKey, "post", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Post$/, '$1'), descriptor.value);
        return descriptor;
    };
    return typeof route === 'object' ? f.apply(undefined, arguments) : f;
}


export function HttpPut(route?: string) : (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
export function HttpPut(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>):TypedPropertyDescriptor<any>;
export function HttpPut(route?: Object, p1?: string, p2?: TypedPropertyDescriptor<any>) {
    let f = function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target.constructor, propertyKey, "put", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Put$/, '$1'), descriptor.value);
        return descriptor;
    };
    return typeof route === 'object' ? f.apply(undefined, arguments) : f;
}


export function HttpPatch(route?: string) : (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
export function HttpPatch(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>):TypedPropertyDescriptor<any>;
export function HttpPatch(route?: Object, p1?: string, p2?: TypedPropertyDescriptor<any>) {
    let f = function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target.constructor, propertyKey, "patch", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Patch$/, '$1'), descriptor.value);
        return descriptor;
    };
    return typeof route === 'object' ? f.apply(undefined, arguments) : f;
}


export function HttpDelete(route?: string) : (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
export function HttpDelete(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>):TypedPropertyDescriptor<any>;
export function HttpDelete(route?: Object, p1?: string, p2?: TypedPropertyDescriptor<any>) {
    let f = function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target.constructor, propertyKey, "delete", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Delete$/, '$1'), descriptor.value);
        return descriptor;
    };
    return typeof route === 'object' ? f.apply(undefined, arguments) : f;
}


export function HttpOptions(route?: string) : (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
export function HttpOptions(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>):TypedPropertyDescriptor<any>;
export function HttpOptions(route?: Object, p1?: string, p2?: TypedPropertyDescriptor<any>) {
    let f = function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target.constructor, propertyKey, "options", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Options$/, '$1'), descriptor.value);
        return descriptor;
    };
    return typeof route === 'object' ? f.apply(undefined, arguments) : f;
}


export function HttpHead(route?: string) : (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
export function HttpHead(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>):TypedPropertyDescriptor<any>;
export function HttpHead(route?: Object, p1?: string, p2?: TypedPropertyDescriptor<any>) {
    let f = function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target.constructor, propertyKey, "head", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Head$/, '$1'), descriptor.value);
        return descriptor;
    };
    return typeof route === 'object' ? f.apply(undefined, arguments) : f;
}



export function Route<TFunction extends Function>(route?: string) : (target:TFunction) => any;
export function Route<TFunction extends Function>(target: TFunction) : any;
export function Route(route?: string) : (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
export function Route(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>):TypedPropertyDescriptor<any>;
export function Route(route?: Object, p1?: string, p2?: TypedPropertyDescriptor<any>) {
    let routeMethod = function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target.constructor, propertyKey, "all", typeof route === 'string' ? route : propertyKey, descriptor.value);
        return descriptor;
    }
    let routeClass = function(target: Object) {
        Reflect.defineMetadata(MetadataSymbols.ControllerRoutePrefixSymbol, typeof route === 'string' ? route : (<any>target).name, target);
        return target;
    }
    return function() {
        if (arguments.length === 1) {
            return routeClass.apply(undefined, arguments);
        }
        return routeMethod.apply(undefined, arguments);
    }
}

export interface RouteParameterMetadata {
    index: number;
    kind: string;
    name?: string;
    type: any;
}

function addParameterMetadata(target: Object, propertyKey: string, parameterIndex: number, kind: string, paramName?: string) {
    let metadata: RouteParameterMetadata[] = Reflect.getMetadata(MetadataSymbols.ControllerRouteParamsSymbol, target, propertyKey) || [];
    let params: any[] = Reflect.getMetadata("design:paramtypes", target, propertyKey) || [];
    metadata.push({ index: parameterIndex, kind, type: params[parameterIndex], name: paramName });
    Reflect.defineMetadata(MetadataSymbols.ControllerRouteParamsSymbol, metadata, target, propertyKey);
}


export function FromBody(name?: string) : (target: Object, propertyKey: string, parameterIndex: number) => void;
export function FromBody(target: Object, propertyKey: string, parameterIndex: number): void;
export function FromBody(name?: Object) {
    let f = function (target: Object, propertyKey: string, parameterIndex: number) {
        addParameterMetadata(target, propertyKey, parameterIndex, "body", typeof name === 'string' ? name : undefined);
    };
    return typeof name === 'object' ? f.apply(undefined, arguments) : f;
}


export function FromForm(name?: string) : (target: Object, propertyKey: string, parameterIndex: number) => void;
export function FromForm(target: Object, propertyKey: string, parameterIndex: number): void;
export function FromForm(name?: Object) {
    let f = function (target: Object, propertyKey: string, parameterIndex: number) {
        addParameterMetadata(target, propertyKey, parameterIndex, "form", typeof name === 'string' ? name : undefined);
    };
    return typeof name === 'object' ? f.apply(undefined, arguments) : f;
}


export function FromHeader(name?: string) : (target: Object, propertyKey: string, parameterIndex: number) => void;
export function FromHeader(target: Object, propertyKey: string, parameterIndex: number): void;
export function FromHeader(name?: Object) {
    let f = function (target: Object, propertyKey: string, parameterIndex: number) {
        addParameterMetadata(target, propertyKey, parameterIndex, "header", typeof name === 'string' ? name : undefined);
    };
    return typeof name === 'object' ? f.apply(undefined, arguments) : f;
}


export function FromQuery(name?: string) : (target: Object, propertyKey: string, parameterIndex: number) => void;
export function FromQuery(target: Object, propertyKey: string, parameterIndex: number): void;
export function FromQuery(name?: Object) {
    let f = function (target: Object, propertyKey: string, parameterIndex: number) {
        addParameterMetadata(target, propertyKey, parameterIndex, "query", typeof name === 'string' ? name : undefined);
    };
    return typeof name === 'object' ? f.apply(undefined, arguments) : f;
}


export function FromRoute(name?: string) : (target: Object, propertyKey: string, parameterIndex: number) => void;
export function FromRoute(target: Object, propertyKey: string, parameterIndex: number): void;
export function FromRoute(name?: Object) {
    let f = function (target: Object, propertyKey: string, parameterIndex: number) {
        addParameterMetadata(target, propertyKey, parameterIndex, "route", typeof name === 'string' ? name : undefined);
    };
    return typeof name === 'object' ? f.apply(undefined, arguments) : f;
}




export function Inject(target: Object): any {
    if (Reflect.hasMetadata('design:paramtypes', target)) {
        var types = (<Object[]>Reflect.getMetadata('design:paramtypes', target)).map((type: Object) => Reflect.hasMetadata(MetadataSymbols.DependencyServiceTypeSymbol, type) ? type : null);
        if (types.some((type) => type !== null)) {
            Reflect.defineMetadata(MetadataSymbols.DependencyInjectionTypesSymbol, types, target);
        }
    }
    return target;
}

export function SingletonService(target: Object): any {
    Inject(target);
    Reflect.defineMetadata(MetadataSymbols.DependencyServiceTypeSymbol, 'singleton', target);
    return target;
}

export function TransientService(target: Object): any {
    Inject(target);
    Reflect.defineMetadata(MetadataSymbols.DependencyServiceTypeSymbol, 'transient', target);
    return target;
}