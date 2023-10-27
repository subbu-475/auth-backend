const express = require ('express');
const { AuthorizeUser } = require('../controllers/login');
const router = express.Router();

router.get("/",async (req,res) => {
    try{
        const auth_token = await req.headers.authorization;
        console.log(auth_token);
        const loginCredentials = AuthorizeUser(auth_token);
        if (loginCredentials===false) {
            res.status(200).send("Invalid Token")
        }
        else {
            res.json(loginCredentials);
        }
    }
    catch(err) {
        console.log(err);
        res.status(400).send("server busy")
    }
})

module.exports = router;