import {Express} from 'express';
import * as fs from 'fs';
import * as path from 'path';
require('reflect-metadata');
import {Controller} from './Controller';

export interface SetupOptions {
    controllerDir?: string;
}

export interface ConstructorFor<T> {
    new (...params: any[]): T;
}

export interface ControllerInfo {
    name: string;
    type: typeof Controller
}

export class DependencyManager {
    private instances: Map<Object, Object> = new Map;

    private getServiceInstance(type: typeof Object): Object {
        if (Reflect.getMetadata("mvc:serviceType", type) === 'singleton') {
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
        if (!Reflect.hasMetadata("mvc:diTypes", ctor)) {
            return new ctor;
        }
        let injectTypes: any[] = Reflect.getMetadata("mvc:diTypes", ctor);
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

export function setup(app: Express, options: SetupOptions = {}): ControllerInfo[] {
    if (!options.controllerDir) {
        options.controllerDir = path.join(process.cwd(), 'controllers');
    }
    let files = fs.readdirSync(options.controllerDir);

    var re = /([A-Za-z0-9]+)Controller\.js$/;
    return files.filter(file => re.test(file)).map(file => {
        let module = require(path.join(options.controllerDir, file));
        let controllerClass: typeof Controller = module[file.replace('.js', '')];
        let route: string = Reflect.getMetadata("controller:routePrefix", controllerClass);
        let controller: Controller;
        controller = dm.getInstance(controllerClass);
        app.use('/' + (route !== undefined ? route : controller.Name), controller.Router);
        return { "name": re.exec(file)[1], "type": controllerClass };
    });

}