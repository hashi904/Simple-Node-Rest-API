require('dotenv').config()
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
        //token keeps 5m. You can set m or s and so on.
        const token = jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '5m'});
        response.json({
            token: token
        })
        return
    }
    response.sendStatus(401)
}

// get item 
const getItem = (request, response) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return response.sendStatus(401)
    //うまく認証できていない　おそらくpayloadだけ見て合っていれば通している 発行したtokenの持続時間の設定が必要
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if (err) {
            console.log(err);
            return response.sendStatus(403)
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