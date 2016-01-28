var express_1 = require('express');
var fs = require('fs');
var path = require('path');
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
    existingData.push({ method: method, route: route.replace(new RegExp(method, 'i'), ''), handler: handler });
    Reflect.defineMetadata("controller:routes", existingData, target);
}
function HttpGet(route) {
    return function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "get", route ? route : propertyKey, descriptor.value);
        return descriptor;
    };
}
exports.HttpGet = HttpGet;
function HttpPost(route) {
    return function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "post", route ? route : propertyKey, descriptor.value);
        return descriptor;
    };
}
exports.HttpPost = HttpPost;
function HttpPut(route) {
    return function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "put", route ? route : propertyKey, descriptor.value);
        return descriptor;
    };
}
exports.HttpPut = HttpPut;
function HttpPatch(route) {
    return function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "patch", route ? route : propertyKey, descriptor.value);
        return descriptor;
    };
}
exports.HttpPatch = HttpPatch;
function HttpDelete(route) {
    return function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "delete", route ? route : propertyKey, descriptor.value);
        return descriptor;
    };
}
exports.HttpDelete = HttpDelete;
function HttpOptions(route) {
    return function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "options", route ? route : propertyKey, descriptor.value);
        return descriptor;
    };
}
exports.HttpOptions = HttpOptions;
function HttpHead(route) {
    return function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "head", route ? route : propertyKey, descriptor.value);
        return descriptor;
    };
}
exports.HttpHead = HttpHead;
function Route(route) {
    var routeMethod = function (target, propertyKey, descriptor) {
        addRouteMetadata(target, "all", route ? route : propertyKey, descriptor.value);
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
            app.use('/' + (route ? route : controller.Name), controller.Router);
        });
    });
}
exports.setup = setup;
