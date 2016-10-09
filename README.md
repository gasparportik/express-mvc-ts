# express-mvc-ts
.NET MVC-like controller structure for Express.js in Typescript

## New in version 0.9.x
Version 0.9.x brings new features that break existing code, initially this version will be tagged with beta, so until more testing is done it wont be available on the `latest` tag.

- Route method parameters are now populated. The logic is the following:
  1. if the parameter type is either `Request` or `Response`, the current instances are injected
  2. if there is an annotation, act accordingly (inject query,form,header,router,body values)
  3. if the parameter type is a class, try to instantiate it with the help of the dependency manager
  4. otherwise try injecting the value from 

### Words of advice
<span style="color: #EE3333;font-weight: bold;">
Since this project is fairly new and it changes a lot even between minor versions, it's recommended that you set a specific version as dependency in your project.json.
</span>

This library depends on the `experimentalDecorators` and `emitDecoratorMetadata` typescript compiler option which are experimental and may change in the future rendering this library useless.

## Purpose
Allows you to write better structured, declaration-oriented and more concise code for your ExpressJS application. The library is mostly inspired by the ASP.NET MVC project with many names being identical.

## Getting started
- Add the library to your project:
```shell
npm install --save express-mvc-ts
```
- Grab the typescript definition file (`express-mvc-ts.d.ts`) from the github page and add it to your project. No definitelytyped/tsd/type/@types support yet.
- Add the `experimentalDecorators` and `emitDecoratorMetadata` compiler options to your typescript configuration with the value `true`.
- Transform your existing ExpressJS code:
```javascript
app.get('/', function (req, res) {
    refererService.saveReferer(req.query.referer);
    res.render('home');
});

app.get('/about', function (req, res) {
    if (req.get('Content-Type') === 'application/json') {
        res.json({ description: "This is my site." });
    } else {
        res.render('about');
    }
});

app.get('/contact/form(/:reason)?', function (req, res) {
    res.render('contact/index', { reason: req.params.reason });
});

app.post('/contact/api/save', function (req, res) {
    var contactRequest = req.body;
    myDataStore.saveContactRequest(contactRequest)
        .then(() => res.json({ success: true }))
        .catch(() => res.json({ success: false }));
});

```
to Controllers `*`:
 ```typescript
import { Controller, Inject, Route, HttpGet, HttpPost, FromHeader } from 'express-mvc-ts';
import { MyRefererDataService } from '../services/refererServices';

@Inject
@Route('')
export class HomeController extends Controller {

    @HttpGet
    public index(referer: string, refererService: MyRefererDataService) {
        refererService.saveReferer(referer);
        return this.view();
    }

    @HttpGet
    public about( @FromHeader('Content-Type') contentType: string) {
        if (contentType === 'application/json') {
            return this.json({ description: "This is my site." });
        } else {
            return this.view('about');
        }
    }
}

@Inject
export class ContactController extends Controller {

    public constructor(private dataStore: MyCoolDataStoreService) {
        super();
    }

    @HttpGet('form(/:reason)?')
    public form(reason: string) {
        return this.view('contact', { reason });
    }

    @HttpPost('api/save')
    public save( @FromBody contactRequest: IContactRequest) {
        return this.dataStore.saveContactRequest(contactRequest)
            .then((response) => this.json({ success: true, response }))
            .catch(() => this.json({ success: false }));
    }
}
 ```
- Invoke the `setup` method on your app `*`:
```typescript
// 1. Include the library
import * as mvc from 'express-mvc-ts';

// 2. Instantiate and configure your ExpressJS app
var app = Express();
// ... configure

// 3. Call mvc.setup on your app
mvc.setup(app);

// 4. Profit
app.listen(); 
``` 
 `*` *these code samples were not tested, nor do they represent viable real-life scenarios. Detailed samples are coming soon*
 
## Caveats / Todos
 - The default value for the `view` response is always `index`, this should be the name of the method, like in .NET MVC.
 - ~~There is currently no point specifying method parameters as they will not be populated. The plan is to ultimately have request parameters bound to method parameters like `?name=John` => `public profile(name: string) { this.request.query.name === name; }`~~
 - If the resulting code is minified, route method parameters may not work since variable names will be mangled/shortened. To avoid this, specify the names explicitly (i.e. `method(@FromQuery('search') search:string)`).
 - Probably a bunch of other things...