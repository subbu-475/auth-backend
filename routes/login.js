const express = require ('express');
const { AuthenticateUser } = require('../controllers/login');
const router = express.Router();

router.post('/',async (req,res)=>{
    const {email,password} = req.body;
    let loginCredentials = await AuthenticateUser(email,password);
    console.log(loginCredentials);
    if (loginCredentials==="Invalid User name or Password"){
        res.status(200).send("Invalid User name or Password")
    }else if(loginCredentials==="server busy"){
        res.status(200).send("server busy")
    }else {
        res.status(200).json({token:loginCredentials.token});
    }
})

module.exports = router;