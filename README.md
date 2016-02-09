# express-mvc-ts
.NET MVC-like controller structure for Express.js in Typescript

## Purpose
Brings the familiarity of .NET MVC Controllers to Express.js - with the help of Typescript - with some limitations.

## Why?
Because for people accustomed to MVC frameworks, this:
```javascript
app.get('/', function (req, res) {
    res.render('home/index');
});

app.get('/about', function (req, res) {
    res.render('home/about');
});

app.get('/contact(/:reason)?', function (req, res) {
    res.render('home/index', { reason: req.params.reason });
});

app.post('/contact', function (req, res) {
    myDataStore.saveContactRequest(req.body)
        .then(() => res.render('contact', { success: true }))
        .catch(() => res.render('contact', { success: false }));
});

```

 doesn't look as nice as this:
 ```javascript
@Route('')
export class HomeController extends Controller {

    private dataStore: MyCoolDataStore = new MyCoolDataStore();

    @HttpGet
    public index() {
        return this.view();
    }

    @HttpGet
    public about() {
        return this.view('about');
    }

    @HttpGet('contact(/:reason)?')
    public contact() {
        return this.view('contact', { reason: this.request.params.reason });
    }

    @HttpPost
    public contactPost() {
        return this.dataStore.saveContactRequest(this.request.body)
            .then(() => this.view('contact', { success: true }))
            .catch(() => this.view('contact', { success: false }));
    }

}
 ```
 
## How?
This can be done thanks to the magic of Typescript decorators and reflection metadata.
So this is quite unusable in simple javascript scenarios, hence the name suffix: -ts; 
 
## Usage
 - Add this package to your dependencies.
 - Grab the typescript definition file from the github page and put it in your projects definition folder( or however you manage your definitions). Not definitelytype/tsd support yet.
 - Create your controller classes in a `controllers` folder (configurable). They should look like this:

```javascript
import {Controller, HttpGet, HttpPost} from 'express-mvc-ts';

export class MyCoolController extends Controller {

    @HttpGet
    public index() {
        return this.view();
    }

    @HttpGet
    public posted() {
        return this.view();
    }
}
```
The above example will bind the routes `get('/mycool',...)` and `post('/mycool/posted',...)`.
For more route annotations check out the definition file.
 - In your app.ts call:
```javascript
import * as mvc from 'express-mvc-ts';
//initialize app
mvc.setup(app);
app.listn();
```
 
## Caveats / Todos
 - The default value for the `view` response is always `index`, this should be the name of the method, like in .NET MVC.
 - In case async work is done inside a method, the `this.request` and `this.response` values need to be cached before doing any async calls, as simultaneous request will overwrite the values.
 - There is currently no point specifying method parameters as they will not be populated. The plan is to ultimately have request parameters bound to method parameters like `?name=John` => `public profile(name: string) { this.request.query.name === name; }`
 - Probably a bunch of other things...