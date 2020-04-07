// import library
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//controll json from client server
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// setting port (=7700)
const port = process.env.PORT || 7700;

//reading files
const queries = require('./queries');

//setting request
app.get('/get_item/', queries.getItem);
app.post('/post_item/', queries.postItem);

//inform the port number in console
app.listen(port, () => console.log(`Listening on port ${port}...`));
