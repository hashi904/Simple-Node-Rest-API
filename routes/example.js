//example query file
//reading .env file
require('dotenv').config();

// import library
const express = require('express');
const router = express.Router();
const Pool = require('pg').Pool;
const jwt = require("jsonwebtoken");
const log4js = require('log4js');
const logger_config = require('../config/logger_config');

//logger config level(trace, warn, error)
log4js.configure(logger_config);
//'system' is setting default:{appenders: ~}
const logger = log4js.getLogger('system');

//database connection setting
const pool = new Pool({
    user: 'root',
    host: 'localhost',
    database: 'wepsdb',
    password: '',
    port: 5432,
});

//setting schema and table
const schema_name = "apps_schema";
const table_name  = "apps_table";

router.get('/', (req, res)=>{
    // get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    // token authentication
    try{
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
            if (err) {
                return res.sendStatus(403);
            }
            pool.query(`SELECT * FROM \"${schema_name}\".\"${table_name}\"`, (err, results) => {
                if(err){
                    logger.error(err);
                    return res.status(400).json(err.toString());
                }
                res.status(200).json(results.rows);
            });
        });
    }catch(err){
        res.json({message: err});
    }
});

router.get('/:postId', (req, res)=>{
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
            pool.query(`SELECT * FROM \"${schema_name}\".\"${table_name}\" WHERE id = \'${postId}\'`, (err, results) => {
                if(err){
                    logger.error(err);
                    return res.status(400).json(err.toString());
                }
                res.status(200).json(results.rows);
            });
        });
    }catch(err){
        res.json({message: err});
    }
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

    //get json, example {shorttext: "hogehoge"}
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
            pool.query(`INSERT INTO \"${schema_name}\".\"${table_name}\" VALUES ($1, $2)`,[id, text], (err, results) => {
                if(err){
                    logger.error(err);
                    return res.status(400).json(err.toString());
                }
                res.sendStatus(201);
            });
        });
    }catch(err){
        res.json({message: err});
    }
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
                if(err){
                    logger.error(err);
                    return res.status(400).json(err.toString());
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
                    logger.error(err);
                    return res.status(400).json(err.toString());
                }
                res.sendStatus(200);
            });
        }); 
    }catch(err){
        res.json({message: err});
    }
});

module.exports = router;