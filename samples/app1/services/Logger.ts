import {SingletonService} from 'express-mvc-ts';
import * as fs from 'fs';

@SingletonService
export default class Logger {
    log(message: string, level: string = 'info') {
        const lpad = (str: string, padString: string, length: number): string => {
            while (str.length < length) {
                str = padString + str;
            }
            return str;
        };
        const reset = '\x1B[0m';
        const colors: { [key: string]: string } = {
            error: '\x1B[31m',
            warning: '\x1B[33m',
            fine: '\x1B[32m',
            info: '\x1B[37m'
        };

        let color = colors[level] || '';
        let now = new Date();
        let date = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
        let time = [now.getHours(), now.getMinutes(), now.getSeconds()].map((part) => lpad(part.toString(), '0', 2)).join(':');
        level = lpad(level, ' ', 8);
        console.log(`${color}${date} ${time} [${level}] ${message}${reset}`);
    }

    error(message: string) {
        this.log(message, 'error');
    }

    warning(message: string) {
        this.log(message, 'warning');
    }

    info(message: string) {
        this.log(message, 'info');
    }

    fine(message: string) {
        this.log(message, 'fine');
    }

    debug(message: string) {
        this.log(message, 'debug');
    }

    dump(obj: any, message: string = "") {
        this.debug(message + ":" + JSON.stringify(obj, null, 2));
    }

}
