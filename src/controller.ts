import * as express from 'express';

export interface IController {
    router: express.Router;
}

/**
 * Base class for MVC-like controllers
 */
export class Controller implements IController {
    public router: express.Router;

    public constructor() {

    }

    protected view(): Promise<ViewResult>;
    protected view(viewName: string): Promise<ViewResult>;
    protected view(modelData: Object): Promise<ViewResult>;
    protected view(viewName: string, modelData: Object): Promise<ViewResult>;
    protected view(arg1?: string | Object, arg2?: Object): Promise<ViewResult> {
        let viewName = 'index';
        let modelData: Object | undefined = undefined;
        if (typeof arg1 === 'object') {
            modelData = arg1;

        } else if (arg1 !== undefined) {
            viewName = arg1;
        }
        return Promise.resolve<ViewResult>({ type: 'view', name: getControllerName((this as Object).constructor) + '/' + viewName, data: modelData });
    }

    protected redirect(url: string): Promise<RedirectResult> {
        return Promise.resolve<RedirectResult>({ type: 'redirect', url });
    }

    protected json(data: any): Promise<JsonResult> {
        return Promise.resolve<JsonResult>({ type: 'json', data });
    }

    protected content(data: any): Promise<ContentResult> {
        return Promise.resolve<ContentResult>({ type: 'content', data });
    }

    protected file(data: any): Promise<FileContentResult> {
        return Promise.resolve<FileContentResult>({ type: 'file', data });
    }
}


export interface ViewResult {
    type: "view";
    name: string;
    data: any;
}

export interface RedirectResult {
    type: "redirect";
    url: string;
}

export interface JsonResult {
    type: "json";
    data: any;
}

export interface ContentResult {
    type: "content";
    data: string;
}

export interface FileContentResult {
    type: "file";
    data: string;
}

export type RouteResult = ViewResult | JsonResult | RedirectResult | ContentResult | FileContentResult;

export function handleResult(res: express.Response, result: RouteResult) {
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

export function getControllerName(controller: Function) {
    function lcFirst(str: string) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
    return lcFirst((controller as any).name.replace(/Controller$/, ''));
}