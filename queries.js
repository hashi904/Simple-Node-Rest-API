const Pool = require('pg').Pool
var jwt = require("jsonwebtoken");
//database connection setting
const pool = new Pool({
    user: 'root',
    host: 'localhost',
    database: 'wepsdb',
    password: '',
    port: 5432,
})

//user authenitication
const user_authenitcation = (request, response) => {
    //user information
    const authenticated_user = {user: "user0", pass: "pass0"}
    const {user, pass} = request.body;
    if(user === authenticated_user.user && pass === authenticated_user.pass){
        //const token = jwt.sign(user, 'private', {algorithm: 'RS256', expiresIn: 120});
        //token keeps 1 minutes(60*5)
        const token = jwt.sign({ user: user, expiresIn: "1ms"}, 'kokonihananndemoireteiiyo');
        response.json({
            token: token
        })
        return
    }
    response.json({
        msg: "Not collected user or password"
    })
}

// get item 
const getItem = (request, response) => {
    const token = request.body.token;
    jwt.verify(token, 'kokonihananndemoireteiiyo', function(err, decoded) {
        if (err) {
            console.log(err);
            return response.json({
                msg: "Invalid token"
            })  
        }
        pool.query("SELECT * FROM \"apps_schema\".\"apps_table\"", (error, results) => {
            if(error){
                throw error;
            }
            response.status(200).json(results.rows)
        })
    });
}

//post item
const postItem = (request, response) => {
    // ID automatically creates using hexadecimal, and consists of 32 texts.
    const original_text = 'ABCDEF0123456789';
    let id = '';
    for (let i = 0; i < 32; i++) {
		id += original_text.charAt(Math.floor(Math.random() * original_text.length));
	}

    // received json variable
    //post json example {token: "hoge", shorttext: "hogehoge"}
    const {token,text} = request.body;
    jwt.verify(token, 'kokonihananndemoireteiiyo', function(err, decoded) {
        if (err) {
            console.log(err);
            return response.json({
                msg: "Invalid token"
            })  
        }

        //we don't permit empty 
        if(!text){
            throw("not empty")
        }

        pool.query("INSERT INTO \"apps_schema\".\"apps_table\" VALUES ($1, $2)",[id, text], (error, results) => {
            if(error){
                throw error;
            }
            response.status(200).json(results.rows)
        })
    
    });
}

//setting exports module to read vriable module from index.js
module.exports = {
    user_authenitcation,
    getItem,
    postItem
}