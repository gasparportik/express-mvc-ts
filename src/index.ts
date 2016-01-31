import {Express} from 'express';
import * as fs from 'fs';
import * as path from 'path';
require('reflect-metadata');
import {Controller} from './Controller';

export interface SetupOptions {
    controllerDir?: string;
}

export function setup(app: Express, options: SetupOptions = {}) {
    if (!options.controllerDir) {
        options.controllerDir = path.join(process.cwd(), 'controllers');
    }
    fs.readdir(options.controllerDir, (err, files) => {
        if (err) {
            return;
        }
        var re = /[A-Za-z0-9]+Controller\.js$/;
        files.filter(file => re.test(file)).forEach(file => {
            let module = require(path.join(options.controllerDir, file));
            let controllerClass = module[file.replace('.js', '')];
            let controller: Controller = new controllerClass;
            let route: string = Reflect.getMetadata("controller:routePrefix", controllerClass);
            app.use('/' + (route !== undefined ? route : controller.Name), controller.Router);
        });
    });

}