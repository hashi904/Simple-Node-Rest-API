//example query file
require('dotenv').config()

const express = require('express');
const router = express.Router();
const Pool = require('pg').Pool;
const jwt = require("jsonwebtoken");

//database connection setting
const pool = new Pool({
    user: 'root',
    host: 'localhost',
    database: 'wepsdb',
    password: '',
    port: 5432,
});

//schema table を定義
const schema_name = "apps_schema";
const table_name  = "apps_table";

router.get('/', (req, res)=>{
    // get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    // token authentication
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if (err) {
            return res.sendStatus(403);
        }
        pool.query(`SELECT * FROM \"${schema_name}\".\"${table_name}\"`, (err, results) => {
            if(err){
                throw err;
            }
            res.status(200).json(results.rows);
        });
    });
});

router.get('/:postId', (req, res)=>{
    // get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    //get from URI
    postId = req.params.postId;

    // token authentication
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if (err) {
            return res.sendStatus(403);
        }
        pool.query(`SELECT * FROM \"${schema_name}\".\"${table_name}\" WHERE id = \'${postId}\'`, (err, results) => {
            if(err){
                throw err;
            }
            res.status(200).json(results.rows);
        });
    });
});

router.post('/', (req, res) => {
    // ID automatically creates using hexadecimal, and consists of 32 texts.
    const original_text = 'ABCDEF0123456789';
    let id = '';
    for (let i = 0; i < 32; i++) {
		id += original_text.charAt(Math.floor(Math.random() * original_text.length));
	}

    // get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    //get json example {shorttext: "hogehoge"}
    const text = req.body.text;

    //token authentication
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if (err) {
            return response.sendStatus(403);
        }
        //we don't permit empty 
        if(!text){
            throw("not empty");
        }
        pool.query(`INSERT INTO \"${schema_name}\".\"${table_name}\" VALUES ($1, $2)`,[id, text], (err, results) => {
            if(err){
                throw err;
            }
            res.sendStatus(201);
        });
    });
});

router.delete('/:postId', (req, res)=>{
    // get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    //get from URI
    postId = req.params.postId;

    // token authentication
    try{
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
            if (err) {
                return res.sendStatus(403);
            }
            pool.query(`DELETE FROM \"${schema_name}\".\"${table_name}\" WHERE id = \'${postId}\'`, (err, results) => {
                // id間違ったときの処理がうまく行かない idを間違っていてもそのままリクエストが通ってしまう　その場合DBの操作は行われない
                if(err){
                    res.json({message: err});
                }
                res.sendStatus(200);
            });
        });
    }catch(err){
        res.json({message: err});
    }
});

router.patch('/:postId', (req, res)=>{
    // get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    //get from URI
    postId = req.params.postId;

    //get from json example {shorttext: "hogehoge"}
    const text = req.body.text;

    //token authentication
    try{
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
            if (err) {
                return res.sendStatus(403);
            }
            //we don't permit empty 
            if(!text){
                throw("not empty");
            }
            pool.query(`UPDATE \"${schema_name}\".\"${table_name}\" SET text = \'${text}\' WHERE id = \'${postId}\'`, (err, results) => {
                if(err){
                    res.json({message: err});
                }
                res.sendStatus(200);
            });
        }); 
    }catch(err){
        res.json({message: err});
    }
});

module.exports = router;