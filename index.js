// import library
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const log4js = require('log4js')

//logger config level(trace, warn, error)
log4js.configure({
    appenders: {
        system: {type: 'file', filename: './log/system.log'}
    },
    categories: {
        default: {appenders: ['system'], level: 'trace'},
    }
});
//'system' is setting default:{appenders: ~}
const logger = log4js.getLogger('system');

//Midleware
app.use(bodyParser.json());
app.use(cors())

//routes (if you want to add requests, add routes)
const user_authenticationRoute = require('./routes/user_authentication');
app.use('/user_authentication', user_authenticationRoute);

//example routes
const exmaple_query = require('./routes/example');
app.use('/example', exmaple_query);

// setting port (=7700)
const port = process.env.PORT || 7700;

//inform the port number in console
app.listen(port, () => logger.info(`Listening on port ${port}...`));