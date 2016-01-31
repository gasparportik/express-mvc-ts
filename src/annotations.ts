/// <reference path="index.ts" />
export interface RouteMetadata {
    method: string;
    route: string;
    handler: Function;
}

function addRouteMetadata(target: Object, method: string, route: string, handler: Function) {
    let existingData: RouteMetadata[] = Reflect.getMetadata("controller:routes", target);
    if (existingData === undefined) {
        existingData = [];
    }
    existingData.push({ method, route: route === 'index' ? '' : route, handler });
    Reflect.defineMetadata("controller:routes", existingData, target);
}

export function HttpGet(route?: string) {
    let f = function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target, "get", route !== undefined ? route : propertyKey.replace(/^(.+)Get$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f : f.apply(this, arguments);
}

export function HttpPost(route?: string) {
    let f = function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target, "post", route !== undefined ? route : propertyKey.replace(/^(.+)Post$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f : f.apply(this, arguments);
}

export function HttpPut(route?: string) {
    let f = function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target, "put", route !== undefined ? route : propertyKey.replace(/^(.+)Put$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f : f.apply(this, arguments);
}

export function HttpPatch(route?: string) {
    let f = function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target, "patch", route !== undefined ? route : propertyKey.replace(/^(.+)Patch$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f : f.apply(this, arguments);
}

export function HttpDelete(route?: string) {
    let f = function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target, "delete", route !== undefined ? route : propertyKey.replace(/^(.+)Delete$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f : f.apply(this, arguments);
}

export function HttpOptions(route?: string) {
    let f = function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target, "options", route !== undefined ? route : propertyKey.replace(/^(.+)Options$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f : f.apply(this, arguments);
}

export function HttpHead(route?: string) {
    let f = function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target, "head", route !== undefined ? route : propertyKey.replace(/^(.+)Head$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f : f.apply(this, arguments);
}

export function Route(route?: string) {
    let routeMethod = function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        addRouteMetadata(target, "all", route !== undefined ? route : propertyKey, descriptor.value);
        return descriptor;
    }
    let routeClass = function(target: Object) {
        Reflect.defineMetadata("controller:routePrefix", route !== undefined ? route : (<any>target).name, target);
        return target;
    }
    return function() {
        if (arguments.length === 1) {
            return routeClass.apply(this, arguments);
        }
        return routeMethod.apply(this, arguments);
    }
}
