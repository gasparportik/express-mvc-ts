var dot = require('dot');
var through = require('through2');
var gutil = require('gulp-util');

function dotter(options) {
    var dotOptions = {
        evaluate: /\{\{([\s\S]+?)\}\}/g,
        interpolate: /\{\{=([\s\S]+?)\}\}/g,
        encode: /\{\{!([\s\S]+?)\}\}/g,
        use: /\{\{#([\s\S]+?)\}\}/g,
        define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
        conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
        iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
        strip: false
    };
    options = options || {};
    return through.obj(function (file, unused, cb) {
        var self = this
        var contents = file.contents.toString();
        var extension = options.ext || '.js';
        var extMatch;
        while (extMatch = dotOptions.define.exec(contents)) {
            if (extMatch[1] === "ext") {
                extension = JSON.parse(extMatch[3]);
            }
        }
        dotOptions.define.lastIndex = 0;
        var renderer = dot.template(contents, dotOptions);
        file.path = gutil.replaceExtension(file.path, extension);
        file.contents = new Buffer(renderer({}));
        self.push(file);
        cb();
    });
}
module.exports = dotter;