import {Express} from 'express';
import * as fs from 'fs';
import * as path from 'path';
require('reflect-metadata');
import {Controller} from './Controller';

export interface SetupOptions {
    controllerDir?: string;
}

export interface ControllerInfo {
    name: string;
    type: Function
}

class DependencyManager {
    private instances: Map<Object, Object> = new Map;

    public getServiceInstance(type: { new (): Object }): Object {
        if (Reflect.getMetadata("mvc:serviceType", type) === 'singleton') {
            let instance = this.instances.get(type);
            if (!instance) {
                instance = new type;
                this.instances.set(type, instance);
            }
            return instance;
        } else {
            return new type;
        }
    }

    public instantiateController(controller: Object, injectTypes: any[]) {
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
            params.unshift(this.getServiceInstance(type));
        }
        params.unshift(null);
        return new (Function.prototype.bind.apply(controller, params));
    }
}

var dm = new DependencyManager();

export function setup(app: Express, options: SetupOptions = {}): ControllerInfo[] {
    if (!options.controllerDir) {
        options.controllerDir = path.join(process.cwd(), 'controllers');
    }
    let files = fs.readdirSync(options.controllerDir);

    var re = /([A-Za-z0-9]+)Controller\.js$/;
    return files.filter(file => re.test(file)).map(file => {
        let module = require(path.join(options.controllerDir, file));
        let controllerClass = module[file.replace('.js', '')];
        let route: string = Reflect.getMetadata("controller:routePrefix", controllerClass);
        let controller: Controller;
        if (Reflect.hasMetadata("mvc:diTypes", controllerClass)) {
            controller = dm.instantiateController(controllerClass, Reflect.getMetadata("mvc:diTypes", controllerClass));
        } else {
            controller = new controllerClass;
        }
        app.use('/' + (route !== undefined ? route : controller.Name), controller.Router);
        return { "name": re.exec(file)[1], "type": controllerClass };
    });

}