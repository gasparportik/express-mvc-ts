var through = require('through2');

function stripDeclares() {
    return through.obj(function (file, unused, cb) {
        var contents = file.contents.toString();
        contents = contents.replace(/^export declare (.+)$/gm, 'export $1');
        contents = contents.replace(/^import .+ from '\.\/.+$/gm, '');
        contents = contents.replace(/^export .+ from '\.\/.+$/gm, '');
        file.contents = new Buffer(contents);
        this.push(file);
        cb();
    });
}

function wrapModule(name) {
    return through.obj(function (file, unused, cb) {
        var contents = file.contents.toString();
        contents = "declare module '" + name + "' {\n    // begin module\n" + contents.split("\n").map(line => line.replace(/^(.)/, '    $1')).join("\n") + "\n}"
        file.contents = new Buffer(contents);
        this.push(file);
        cb();
    });
}

function variousHacks() {
    return through.obj(function (file, unused, cb) {
        var contents = file.contents.toString();
        contents = contents.replace(/^ *\/\/\/ *<reference .+$/gm, '');
        contents = contents.replace(/^ *import .+ from '.+$/gm, '');
        contents = contents.replace(/^( *)\/\/ *begin module *$/gm, "$&\n    import * as express from 'express';");
        file.contents = new Buffer(contents);
        this.push(file);
        cb();
    });
}

module.exports = {
    stripDeclares: stripDeclares,
    wrapModule: wrapModule,
    variousHacks: variousHacks
}