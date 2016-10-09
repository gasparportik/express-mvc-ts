import { MetadataSymbols } from './annotations.g';

export interface ConstructorFor<T> {
    new (...params: any[]): T;
}

export class DependencyManager {
    private instances: Map<Object, Object> = new Map();

    private getServiceInstance(type: typeof Object): Object {
        if (Reflect.getMetadata(MetadataSymbols.DependencyServiceTypeSymbol, type) === 'singleton') {
            let instance = this.instances.get(type);
            if (!instance) {
                instance = this.getInstance(type);
                this.instances.set(type, instance);
            }
            return instance;
        } else {
            return this.getInstance(type);
        }
    }

    public getInstance<T>(ctor: ConstructorFor<T>): T {
        if (!Reflect.hasMetadata(MetadataSymbols.DependencyInjectionTypesSymbol, ctor)) {
            return new ctor;
        }
        let injectTypes: any[] = Reflect.getMetadata(MetadataSymbols.DependencyInjectionTypesSymbol, ctor);
        let foundOne = false;
        let params: any[] = [];
        for (let i = injectTypes.length - 1; i >= 0; --i) {
            let type = injectTypes[i];
            if (!foundOne) {
                if (type === null) {
                    continue;
                } else {
                    foundOne = true;
                }
            }
            params.unshift(type === null ? undefined : this.getServiceInstance(type));
        }
        params.unshift(null);
        return new (Function.prototype.bind.apply(ctor, params));
    }
}

export const dm = new DependencyManager();