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

export function setup(app: Express, options: SetupOptions = {}): ControllerInfo[] {
    if (!options.controllerDir) {
        options.controllerDir = path.join(process.cwd(), 'controllers');
    }
    let files = fs.readdirSync(options.controllerDir);

    var re = /([A-Za-z0-9]+)Controller\.js$/;
    return files.filter(file => re.test(file)).map(file => {
        let module = require(path.join(options.controllerDir, file));
        let controllerClass = module[file.replace('.js', '')];
        let controller: Controller = new controllerClass;
        let route: string = Reflect.getMetadata("controller:routePrefix", controllerClass);
        app.use('/' + (route !== undefined ? route : controller.Name), controller.Router);
        return { "name": re.exec(file)[1], "type": controllerClass };
    });

}