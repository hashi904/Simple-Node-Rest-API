const Pool = require('pg').Pool

//database connection setting
const pool = new Pool({
    user: 'root',
    host: 'localhost',
    database: 'wepsdb',
    password: '',
    port: 5432,
})

// get item 
const getItem = (request, response) => {
    pool.query("SELECT * FROM \"apps_schema\".\"apps_table\"", (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
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
    //post json example {shorttext: "hogehoge"}
    // not so good if you send same message, this module responses error
    const text = request.body.text;
    //you must not permit empty 
    if(!text){
        throw("not empty")
    }

    pool.query("INSERT INTO \"apps_schema\".\"apps_table\" VALUES ($1, $2)",[id, text], (error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

//setting exports module to read vriable module from index.js
module.exports = {
    getItem,
    postItem
}