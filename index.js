'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var express = require('express');
var fs = require('fs');
var path = require('path');

(function (MetadataSymbols) {
    MetadataSymbols.ControllerRoutesSymbol = Symbol.for("mvc:controller:routes");
    MetadataSymbols.ControllerRoutePrefixSymbol = Symbol.for("mvc:controller:routePrefix");
    MetadataSymbols.ControllerRouteParamsSymbol = Symbol.for("mvc:controller:route:params");
    MetadataSymbols.DependencyInjectionTypesSymbol = Symbol.for("mvc:diTypes");
    MetadataSymbols.DependencyServiceTypeSymbol = Symbol.for("mvc:serviceType");
})(exports.MetadataSymbols || (exports.MetadataSymbols = {}));
function addRouteMetadata(target, name, method, route, handler) {
    var existingData = Reflect.getMetadata(exports.MetadataSymbols.ControllerRoutesSymbol, target);
    if (existingData === undefined) {
        existingData = [];
    }
    existingData.push({ method: method, name: name, route: route === 'index' ? '' : route, handler: handler });
    Reflect.defineMetadata(exports.MetadataSymbols.ControllerRoutesSymbol, existingData, target);
}
function HttpGet(route, p1, p2) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target.constructor, propertyKey, "get", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Get$/, '$1'), descriptor.value);
        return descriptor;
    };
    return typeof route === 'object' ? f.apply(undefined, arguments) : f;
}
function HttpPost(route, p1, p2) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target.constructor, propertyKey, "post", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Post$/, '$1'), descriptor.value);
        return descriptor;
    };
    return typeof route === 'object' ? f.apply(undefined, arguments) : f;
}
function HttpPut(route, p1, p2) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target.constructor, propertyKey, "put", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Put$/, '$1'), descriptor.value);
        return descriptor;
    };
    return typeof route === 'object' ? f.apply(undefined, arguments) : f;
}
function HttpPatch(route, p1, p2) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target.constructor, propertyKey, "patch", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Patch$/, '$1'), descriptor.value);
        return descriptor;
    };
    return typeof route === 'object' ? f.apply(undefined, arguments) : f;
}
function HttpDelete(route, p1, p2) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target.constructor, propertyKey, "delete", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Delete$/, '$1'), descriptor.value);
        return descriptor;
    };
    return typeof route === 'object' ? f.apply(undefined, arguments) : f;
}
function HttpOptions(route, p1, p2) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target.constructor, propertyKey, "options", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Options$/, '$1'), descriptor.value);
        return descriptor;
    };
    return typeof route === 'object' ? f.apply(undefined, arguments) : f;
}
function HttpHead(route, p1, p2) {
    var f = function (target, propertyKey, descriptor) {
        addRouteMetadata(target.constructor, propertyKey, "head", typeof route === 'string' ? route : propertyKey.replace(/^(.+)Head$/, '$1'), descriptor.value);
        return descriptor;
    };
    return typeof route === 'object' ? f.apply(undefined, arguments) : f;
}
function Route(route, p1, p2) {
    var routeMethod = function (target, propertyKey, descriptor) {
        addRouteMetadata(target.constructor, propertyKey, "all", typeof route === 'string' ? route : propertyKey, descriptor.value);
        return descriptor;
    };
    var routeClass = function (target) {
        Reflect.defineMetadata(exports.MetadataSymbols.ControllerRoutePrefixSymbol, typeof route === 'string' ? route : target.name, target);
        return target;
    };
    return function () {
        if (arguments.length === 1) {
            return routeClass.apply(undefined, arguments);
        }
        return routeMethod.apply(undefined, arguments);
    };
}
function addParameterMetadata(target, propertyKey, parameterIndex, kind, paramName) {
    var metadata = Reflect.getMetadata(exports.MetadataSymbols.ControllerRouteParamsSymbol, target, propertyKey) || [];
    var params = Reflect.getMetadata("design:paramtypes", target, propertyKey) || [];
    metadata.push({ index: parameterIndex, kind: kind, type: params[parameterIndex], name: paramName });
    Reflect.defineMetadata(exports.MetadataSymbols.ControllerRouteParamsSymbol, metadata, target, propertyKey);
}
function FromBody(name) {
    var f = function (target, propertyKey, parameterIndex) {
        addParameterMetadata(target, propertyKey, parameterIndex, "body", typeof name === 'string' ? name : undefined);
    };
    return typeof name === 'object' ? f.apply(undefined, arguments) : f;
}
function FromForm(name) {
    var f = function (target, propertyKey, parameterIndex) {
        addParameterMetadata(target, propertyKey, parameterIndex, "form", typeof name === 'string' ? name : undefined);
    };
    return typeof name === 'object' ? f.apply(undefined, arguments) : f;
}
function FromHeader(name) {
    var f = function (target, propertyKey, parameterIndex) {
        addParameterMetadata(target, propertyKey, parameterIndex, "header", typeof name === 'string' ? name : undefined);
    };
    return typeof name === 'object' ? f.apply(undefined, arguments) : f;
}
function FromQuery(name) {
    var f = function (target, propertyKey, parameterIndex) {
        addParameterMetadata(target, propertyKey, parameterIndex, "query", typeof name === 'string' ? name : undefined);
    };
    return typeof name === 'object' ? f.apply(undefined, arguments) : f;
}
function FromRoute(name) {
    var f = function (target, propertyKey, parameterIndex) {
        addParameterMetadata(target, propertyKey, parameterIndex, "route", typeof name === 'string' ? name : undefined);
    };
    return typeof name === 'object' ? f.apply(undefined, arguments) : f;
}
function Inject(target) {
    if (Reflect.hasMetadata('design:paramtypes', target)) {
        var types = Reflect.getMetadata('design:paramtypes', target).map(function (type) { return Reflect.hasMetadata(exports.MetadataSymbols.DependencyServiceTypeSymbol, type) ? type : null; });
        if (types.some(function (type) { return type !== null; })) {
            Reflect.defineMetadata(exports.MetadataSymbols.DependencyInjectionTypesSymbol, types, target);
        }
    }
    return target;
}
function SingletonService(target) {
    Inject(target);
    Reflect.defineMetadata(exports.MetadataSymbols.DependencyServiceTypeSymbol, 'singleton', target);
    return target;
}
function TransientService(target) {
    Inject(target);
    Reflect.defineMetadata(exports.MetadataSymbols.DependencyServiceTypeSymbol, 'transient', target);
    return target;
}

var DependencyManager = (function () {
    function DependencyManager() {
        this.instances = new Map();
    }
    DependencyManager.prototype.getServiceInstance = function (type) {
        if (Reflect.getMetadata(exports.MetadataSymbols.DependencyServiceTypeSymbol, type) === 'singleton') {
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
        if (!Reflect.hasMetadata(exports.MetadataSymbols.DependencyInjectionTypesSymbol, ctor)) {
            return new ctor;
        }
        var injectTypes = Reflect.getMetadata(exports.MetadataSymbols.DependencyInjectionTypesSymbol, ctor);
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
}());
var dm = new DependencyManager();

var Controller = (function () {
    function Controller() {
    }
    Controller.prototype.view = function (arg1, arg2) {
        var viewName = 'index';
        var modelData = undefined;
        if (typeof arg1 === 'object') {
            modelData = arg1;
        }
        else if (arg1 !== undefined) {
            viewName = arg1;
        }
        return Promise.resolve({ type: 'view', name: getControllerName(this.constructor) + '/' + viewName, data: modelData });
    };
    Controller.prototype.redirect = function (url) {
        return Promise.resolve({ type: 'redirect', url: url });
    };
    Controller.prototype.json = function (data) {
        return Promise.resolve({ type: 'json', data: data });
    };
    Controller.prototype.content = function (data) {
        return Promise.resolve({ type: 'content', data: data });
    };
    Controller.prototype.file = function (data) {
        return Promise.resolve({ type: 'file', data: data });
    };
    return Controller;
}());
function handleResult(res, result) {
    switch (result.type) {
        case 'json':
            res.json(result.data);
            break;
        case 'view':
            res.render(result.name, result.data);
            break;
        case 'redirect':
            res.redirect(result.url);
            break;
        case 'content':
            res.end(result.data);
            break;
        case 'file':
            res.end(result.data);
            break;
        default:
            res.end();
            break;
    }
}
function getControllerName(controller) {
    function lcFirst(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
    return lcFirst(controller.name.replace(/Controller$/, ''));
}

var MvcApp = (function () {
    function MvcApp() {
    }
    return MvcApp;
}());
var Request = (function () {
    function Request() {
    }
    return Request;
}());
var Response = (function () {
    function Response() {
    }
    return Response;
}());
var routing;
(function (routing) {
    function getParamNames(func) {
        var code = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
        var result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);
        if (result !== null) {
            return Array.prototype.slice.call(result);
        }
        return [];
    }
    function createParamFunction(route, controllerClass) {
        var paramTypes = Reflect.getMetadata("design:paramtypes", controllerClass.prototype, route.name);
        var paramAnnotations = [];
        var params = Reflect.getMetadata(exports.MetadataSymbols.ControllerRouteParamsSymbol, controllerClass.prototype, route.name);
        if (params) {
            params.forEach(function (p) { return paramAnnotations[p.index] = p; });
        }
        if (paramTypes && paramTypes.length) {
            var paramNames_1 = getParamNames(route.handler);
            var args = paramTypes.map(function (p, i) {
                if (p === Request) {
                    return 'req';
                }
                if (p === Response) {
                    return 'res';
                }
                var prefix = p === Number ? '+' : p === Boolean ? '!!' : '';
                if (paramAnnotations[i]) {
                    var name = paramAnnotations[i].name || paramNames_1[i];
                    switch (paramAnnotations[i].kind) {
                        case 'body':
                            return "req.body";
                        case 'form':
                            return "req.body && " + prefix + "req.body['" + name + "']";
                        case 'header':
                            return prefix + "req.get('" + name + "')";
                        case 'query':
                            return prefix + "req.query['" + name + "']";
                        case 'route':
                            return prefix + "req.params['" + name + "']";
                        case 'null':
                        default:
                            return 'null';
                    }
                }
                if (typeof p === 'function' && [Number, String, Boolean, Array].indexOf(p) < 0) {
                    return "dm.getInstance(" + p.name + ")";
                }
                return "req.params['" + paramNames_1[i] + "'] !== undefined ? " + prefix + "req.params['" + paramNames_1[i] + "'] : " + prefix + "req.query['" + paramNames_1[i] + "']";
            });
            return new Function('req', 'res', 'dm', "return [" + args.join(', ') + "]");
        }
        return null;
    }
    function setRoutesSingleton(controllerClass, router, dm$$1, debug) {
        var controller;
        controller = dm$$1.getInstance(controllerClass);
        var routes = Reflect.getMetadata(exports.MetadataSymbols.ControllerRoutesSymbol, controllerClass);
        if (!routes) {
            return controller;
        }
        routes.forEach(function (route) {
            var method = router[route.method];
            var paramFunc = createParamFunction(route, controllerClass);
            if (debug) {
                console.log("  |- " + route.method + " /" + route.route);
            }
            method.call(router, '/' + route.route, function (req, res) {
                var resultPromise = paramFunc ? route.handler.apply(controller, paramFunc(req, res, dm$$1)) : route.handler.call(controller);
                if (resultPromise && typeof resultPromise.then === 'function') {
                    resultPromise.then(function (result) { return handleResult(res, result); });
                }
            });
        });
        return controller;
    }
    function setRoutesTransient(controllerClass, router, dm$$1, debug) {
        var routes = Reflect.getMetadata("controller:routes", controllerClass);
        if (!routes) {
            return;
        }
        routes.forEach(function (route) {
            var method = router[route.method];
            method.call(router, '/' + route.route, function (req, res) {
                var controller = dm$$1.getInstance(controllerClass);
                var resultPromise = route.handler.call(controller);
                if (resultPromise && typeof resultPromise.then === 'function') {
                    resultPromise.then(function (result) { return handleResult(res, result); });
                }
            });
        });
    }
    var controllerFileMatcher = /([A-Za-z0-9]+)Controller\.js$/;
    function setup(app, options) {
        if (options === void 0) { options = {}; }
        var controllerDir = options.controllerDir || path.join(process.cwd(), 'controllers');
        var files = fs.readdirSync(controllerDir);
        var dependencyManager = options.dependencyManager || dm;
        var mvcApp = new MvcApp();
        mvcApp.rootRouter = options.singleRouterToApp ? express.Router() : app;
        mvcApp.controllers = files.filter(function (file) { return controllerFileMatcher.test(file); }).map(function (file) {
            var module = require(path.join(controllerDir, file));
            var controllerClass = module[file.replace(/.js/, '')];
            var route = Reflect.getMetadata(exports.MetadataSymbols.ControllerRoutePrefixSymbol, controllerClass);
            if (route === undefined) {
                route = getControllerName(controllerClass);
            }
            if (options.debugRoutes) {
                console.log("  + " + route);
            }
            var router = express.Router();
            var controllerInstance = undefined;
            if (options.transientControllers) {
                setRoutesTransient(controllerClass, router, dependencyManager, options.debugRoutes || false);
            }
            else {
                setRoutesSingleton(controllerClass, router, dependencyManager, options.debugRoutes || false);
            }
            mvcApp.rootRouter.use('/' + route, router);
            return { name: controllerFileMatcher.exec(file)[1], type: controllerClass, instance: controllerInstance };
        });
        return mvcApp;
    }
    routing.setup = setup;
    function setupLazy(app, options) {
        if (options === void 0) { options = {}; }
        var controllerDir = options.controllerDir || path.join(process.cwd(), 'controllers');
        var dependencyManager = options.dependencyManager || dm;
        var mvcApp = new MvcApp();
        mvcApp.rootRouter = options.singleRouterToApp ? express.Router() : app;
        app.use(function (req, res, next) {
            var name = req.url.split(/\//, 2)[1] || 'index';
            var files = fs.readdirSync(controllerDir);
            var re = new RegExp(name + 'Controller\.js$', 'i');
            var file = files.filter(function (file) { return re.test(file); })[0];
            var module = require(path.join(controllerDir, file));
            var controllerClass = module[file.replace(/.js/, '')];
            var route = Reflect.getMetadata(exports.MetadataSymbols.ControllerRoutePrefixSymbol, controllerClass) || getControllerName(controllerClass);
            if (options.debugRoutes) {
                console.log("  + " + route);
            }
            var router = express.Router();
            if (options.transientControllers) {
                setRoutesTransient(controllerClass, router, dependencyManager, options.debugRoutes || false);
            }
            else {
                setRoutesSingleton(controllerClass, router, dependencyManager, options.debugRoutes || false);
            }
            app.use('/' + route, router);
        });
        return mvcApp;
    }
})(routing || (routing = {}));
function setup(app, options) {
    if (options === void 0) { options = {}; }
    return routing.setup(app, options);
}

require('reflect-metadata');

exports.HttpGet = HttpGet;
exports.HttpPost = HttpPost;
exports.HttpPut = HttpPut;
exports.HttpPatch = HttpPatch;
exports.HttpDelete = HttpDelete;
exports.HttpOptions = HttpOptions;
exports.HttpHead = HttpHead;
exports.Route = Route;
exports.FromBody = FromBody;
exports.FromForm = FromForm;
exports.FromHeader = FromHeader;
exports.FromQuery = FromQuery;
exports.FromRoute = FromRoute;
exports.Inject = Inject;
exports.SingletonService = SingletonService;
exports.TransientService = TransientService;
exports.dm = dm;
exports.DependencyManager = DependencyManager;
exports.handleResult = handleResult;
exports.getControllerName = getControllerName;
exports.Controller = Controller;
exports.setup = setup;
exports.MvcApp = MvcApp;
exports.Request = Request;
exports.Response = Response;
