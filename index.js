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
                    var resultPromise = route.handler.call(_this);
                    _this.request = null;
                    _this.response = null;
                    if (resultPromise && typeof resultPromise.then === 'function') {
                        resultPromise.then(function (result) { return _this.handleResult(res, result); });
                    }
                });
            });
        }
    }
    Controller.prototype.handleResult = function (res, result) {
        switch (result.type) {
            case 'json':
                res.json(result.data);
                break;
            case 'view':
                res.render(result.name, result.data);
                break;
            case 'redirect':
                res.redirect(result.data);
                break;
            case 'text':
                res.end(result.data);
                break;
            default:
                res.end();
                break;
        }
    };
    Controller.prototype.view = function (viewName, modelData) {
        if (typeof viewName === 'object') {
            modelData = viewName;
            viewName = undefined;
        }
        if (viewName === undefined) {
            viewName = 'index';
        }
        return Promise.resolve({ type: 'view', name: this.name + '/' + viewName, data: modelData });
    };
    Controller.prototype.redirect = function (url) {
        return Promise.resolve({ type: 'redirect', data: url });
    };
    Controller.prototype.defer = function () {
        var _this = this;
        var promise = new Promise(function (resolve) {
            promise.json = _this.json;
            promise.view = _this.view;
        });
        return promise;
    };
    Controller.prototype.json = function (data) {
        return Promise.resolve({ type: 'json', data: data });
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
        addRouteMetadata(target, "get", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Get$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f.apply(this, arguments) : f;
}
exports.HttpGet = HttpGet;
function HttpPost(route) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "post", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Post$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f.apply(this, arguments) : f;
}
exports.HttpPost = HttpPost;
function HttpPut(route) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "put", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Put$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f.apply(this, arguments) : f;
}
exports.HttpPut = HttpPut;
function HttpPatch(route) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "patch", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Patch$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f.apply(this, arguments) : f;
}
exports.HttpPatch = HttpPatch;
function HttpDelete(route) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "delete", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Delete$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f.apply(this, arguments) : f;
}
exports.HttpDelete = HttpDelete;
function HttpOptions(route) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "options", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Options$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f.apply(this, arguments) : f;
}
exports.HttpOptions = HttpOptions;
function HttpHead(route) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "head", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Head$/, '$1'), descriptor.value);
        return descriptor;
    };
    return (typeof route === 'object') ? f.apply(this, arguments) : f;
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

function Inject(target) {
    if (Reflect.hasMetadata('design:paramtypes', target)) {
        var types = Reflect.getMetadata('design:paramtypes', target).map(function (type) { return Reflect.hasMetadata('mvc:serviceType', type) ? type : null; });
        if (types.some(function (type) { return type !== null; })) {
            Reflect.defineMetadata('mvc:diTypes', types, target);
        }
    }
    return target;
}
exports.Inject = Inject;
function SingletonService(target) {
    Inject(target);
    Reflect.defineMetadata('mvc:serviceType', 'singleton', target);
    return target;
}
exports.SingletonService = SingletonService;
function TransientService(target) {
    Inject(target);
    Reflect.defineMetadata('mvc:serviceType', 'transient', target);
    return target;
}
exports.TransientService = TransientService;

var fs = require('fs');
var path = require('path');
require('reflect-metadata');
var DependencyManager = (function () {
    function DependencyManager() {
        this.instances = new Map;
    }
    DependencyManager.prototype.getServiceInstance = function (type) {
        if (Reflect.getMetadata("mvc:serviceType", type) === 'singleton') {
            var instance = this.instances.get(type);
            if (!instance) {
                instance = this.getInstance(type);
                this.instances.set(type, instance);
            }
            return instance;
        }
        else {
            return this.getInstance(type);
        }
    };
    DependencyManager.prototype.getInstance = function (ctor) {
        if (!Reflect.hasMetadata("mvc:diTypes", ctor)) {
            return new ctor;
        }
        var injectTypes = Reflect.getMetadata("mvc:diTypes", ctor);
        var foundOne = false;
        var params = [];
        for (var i = injectTypes.length - 1; i >= 0; --i) {
            var type = injectTypes[i];
            if (!foundOne) {
                if (type === null) {
                    continue;
                }
                else {
                    foundOne = true;
                }
            }
            params.unshift(type === null ? undefined : this.getServiceInstance(type));
        }
        params.unshift(null);
        return new (Function.prototype.bind.apply(ctor, params));
    };
    return DependencyManager;
})();
exports.DependencyManager = DependencyManager;
exports.dm = new DependencyManager();
function setup(app, options) {
    if (options === void 0) { options = {}; }
    if (!options.controllerDir) {
        options.controllerDir = path.join(process.cwd(), 'controllers');
    }
    var files = fs.readdirSync(options.controllerDir);
    var re = /([A-Za-z0-9]+)Controller\.js$/;
    return files.filter(function (file) { return re.test(file); }).map(function (file) {
        var module = require(path.join(options.controllerDir, file));
        var controllerClass = module[file.replace('.js', '')];
        var route = Reflect.getMetadata("controller:routePrefix", controllerClass);
        var controller;
        controller = exports.dm.getInstance(controllerClass);
        app.use('/' + (route !== undefined ? route : controller.Name), controller.Router);
        return { "name": re.exec(file)[1], "type": controllerClass };
    });
}
exports.setup = setup;
