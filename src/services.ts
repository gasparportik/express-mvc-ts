/// <reference path="index.ts" />

export function Inject(target: Object): any {
    if (Reflect.hasMetadata('design:paramtypes', target)) {
        var types = (<Object[]>Reflect.getMetadata('design:paramtypes', target)).map((type: Object) => Reflect.hasMetadata('mvc:serviceType', type) ? type : null);
        if (types.some((type) => type !== null)) {
            Reflect.defineMetadata('mvc:diTypes', types, target);
        }
    }
    return target;
}

export function SingletonService(target: Object): any {
    Reflect.defineMetadata('mvc:serviceType', 'singleton', target);
    return target;
}

export function TransientService(target: Object): any {
    Reflect.defineMetadata('mvc:serviceType', 'transient', target);
    return target;
}