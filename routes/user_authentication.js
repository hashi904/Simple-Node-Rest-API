//user_authentication
//reading .env file
require('dotenv').config()

const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

//user_authentication
router.post('/', (req, res) => {
    const authenticated_user = {user: "user0", pass: "pass0"};
    const {user, pass} = req.body;
    if(user === authenticated_user.user && pass === authenticated_user.pass){
        //token keeps 5m. You can set m or s and so on.
        const token = jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '5m'});
        res.json({
            token: token
        })
        return
    }
    res.sendStatus(401);
});

module.exports = router;