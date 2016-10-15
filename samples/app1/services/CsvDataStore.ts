import * as fs from 'fs';
import * as stream from 'stream';

export default class CsvDataStore {

    protected stream: stream.Duplex;

    public constructor(file: string, options?: any) {
        this.stream = require('csv-write-stream')(options);
        this.stream.pipe(fs.createWriteStream(file));
    }
}