import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as mvc from 'express-mvc-ts';
import Logger from './services/Logger';

const app = express();

app.engine('dot', require('express-dot-engine').__express);
app.set('view engine', 'dot');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mvc.setup(app);

const port = 3000;
app.listen(port, () => {
    mvc.dm.getInstance(Logger).info(`Application started. Listening on port: ${port}`);
});

