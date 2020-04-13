// import library
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

//Midleware
app.use(bodyParser.json());
app.use(cors())

//routes (if you want to add request, you must add routes)
const user_authenticationRoute = require('./routes/user_authentication');
app.use('/user_authentication', user_authenticationRoute);

const exmaple_query = require('./routes/example');
app.use('/example', exmaple_query);

// setting port (=7700)
const port = process.env.PORT || 7700;

//===================================================================
//reading files
//const queries = require('./queries');

//setting routes
//app.post('/user_authentication/', queries.user_authenitcation);
//app.get('/get_item/', queries.getItem);
//app.post('/post_item/', queries.postItem);
//===================================================================

//inform the port number in console
app.listen(port, () => console.log(`Listening on port ${port}...`));
