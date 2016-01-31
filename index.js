var express_1 = require('express');
var Controller = (function () {
    function Controller() {
        var _this = this;
        var proto = this.constructor;
        this.name = proto.name.replace('Controller', '').toLowerCase();
        this.router = express_1.Router();
        var routes = Reflect.getMetadata("controller:routes", this);
        if (routes) {
            routes.forEach(function (route) {
                var method = _this.router[route.method];
                method.call(_this.router, '/' + route.route, function (req, res) {
                    _this.request = req;
                    _this.response = res;
                    route.handler.call(_this);
                    _this.request = null;
                    _this.response = null;
                });
            });
        }
    }
    Controller.prototype.view = function (viewName, modelData) {
        if (typeof viewName === 'object') {
            modelData = viewName;
            viewName = undefined;
        }
        if (viewName === undefined) {
            viewName = this.request.route.path.substr(1);
        }
        this.response.render(this.name + '/' + viewName, modelData);
    };
    Controller.prototype.json = function (data) {
        this.response.json(data);
    };
    Object.defineProperty(Controller.prototype, "Router", {
        get: function () {
            return this.router;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "Name", {
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    return Controller;
})();
exports.Controller = Controller;

function addRouteMetadata(target, method, route, handler) {
    var existingData = Reflect.getMetadata("controller:routes", target);
    if (existingData === undefined) {
        existingData = [];
    }
    existingData.push({ method: method, route: route === 'index' ? '' : route, handler: handler });
    Reflect.defineMetadata("controller:routes", existingData, target);
}
function HttpGet(route) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "get", route !== undefined ? route : propertyKey.replace(/^(.+)Get$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f : f.apply(this, arguments);
}
exports.HttpGet = HttpGet;
function HttpPost(route) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "post", route !== undefined ? route : propertyKey.replace(/^(.+)Post$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f : f.apply(this, arguments);
}
exports.HttpPost = HttpPost;
function HttpPut(route) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "put", route !== undefined ? route : propertyKey.replace(/^(.+)Put$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f : f.apply(this, arguments);
}
exports.HttpPut = HttpPut;
function HttpPatch(route) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "patch", route !== undefined ? route : propertyKey.replace(/^(.+)Patch$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f : f.apply(this, arguments);
}
exports.HttpPatch = HttpPatch;
function HttpDelete(route) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "delete", route !== undefined ? route : propertyKey.replace(/^(.+)Delete$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f : f.apply(this, arguments);
}
exports.HttpDelete = HttpDelete;
function HttpOptions(route) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "options", route !== undefined ? route : propertyKey.replace(/^(.+)Options$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f : f.apply(this, arguments);
}
exports.HttpOptions = HttpOptions;
function HttpHead(route) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "head", route !== undefined ? route : propertyKey.replace(/^(.+)Head$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f : f.apply(this, arguments);
}
exports.HttpHead = HttpHead;
function Route(route) {
    var routeMethod = function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "all", route !== undefined ? route : propertyKey, descriptor.value);
        return descriptor;
    };
    var routeClass = function (target) {
        Reflect.defineMetadata("controller:routePrefix", route !== undefined ? route : target.name, target);
        return target;
    };
    return function () {
        if (arguments.length === 1) {
            return routeClass.apply(this, arguments);
        }
        return routeMethod.apply(this, arguments);
    };
}
exports.Route = Route;

var fs = require('fs');
var path = require('path');
require('reflect-metadata');
function setup(app, options) {
    if (options === void 0) { options = {}; }
    if (!options.controllerDir) {
        options.controllerDir = path.join(process.cwd(), 'controllers');
    }
    fs.readdir(options.controllerDir, function (err, files) {
        if (err) {
            return;
        }
        var re = /[A-Za-z0-9]+Controller\.js$/;
        files.filter(function (file) { return re.test(file); }).forEach(function (file) {
            var module = require(path.join(options.controllerDir, file));
            var controllerClass = module[file.replace('.js', '')];
            var controller = new controllerClass;
            var route = Reflect.getMetadata("controller:routePrefix", controllerClass);
            app.use('/' + (route !== undefined ? route : controller.Name), controller.Router);
        });
    });
}
exports.setup = setup;
