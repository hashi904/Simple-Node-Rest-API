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
})

router.get('/', (req, res)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    // token authentication
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
        if (err) {
            return res.sendStatus(403);
        }
        pool.query("SELECT * FROM \"apps_schema\".\"apps_table\"", (err, results) => {
            if(err){
                throw err;
            }
            res.status(200).json(results.rows);
        })
    });
});

// router.post('/', (req, res) => {
//     const post = new Post({
//         title: req.body.title,
//         description: req.body.description
//     });
//     try {
//         const savedPost = await post.save();
//         res.json(savedPost);
//     } catch(err) {
//         res.json({message: err});
//     }
// });

// router.get('/:postId', (req, res)=>{
//     try{
//         const post = await Post.findById(req.params.postId)
//         res.json(post);
//     }catch(err){
//         res.json({message: err});
//     }
// });

// router.delete('/:postId', (req, res)=>{
//     try{
//         const removedPost = Post.remove({_id: req.params.postId});
//         res.json(removedPost);
//     }catch(err){
//         res.json({message: err});
//     }
// });

// router.patch('/:postId', (req, res)=>{
//     try{
//         const updatedPost = await Post.updateOne(
//             {_id: req.params.postId},
//             {$set: {title: req.body.title}}
//         );
//         res.json(updatedPost);
//     }catch(err){
//         res.json({message: err});
//     }
// })

module.exports = router;