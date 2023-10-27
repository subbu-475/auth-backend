const express = require ('express');
const { CheckUser } = require('../controllers/login');
const { InsertVerifyUser,InsertSignupUser } = require('../controllers/siginin');
const router = express.Router();

router.get('/:token',async(req,res)=>{
    try{
        const response = await InsertSignupUser(req.params.token);
        res.status(200).send(response);
    }
    catch (e){
        console.log(e);
        res.status(500).send(
        `
        <html>
        <body>
        <h4>Registeration failed</h4>
        <h5>welcome to the app</h5>
        <p>Link expired</p>
        <p>regards</p>
        <p>Team</p>
        </body>
        </html>`
        );
    }

})

router.post('/verify',async(req,res)=>{
    try {
        const {name,email,password} = await req.body;
        console.log(name,email,password);
        const registerCredentials = await CheckUser(email);
        if (registerCredentials===false) {
            await InsertVerifyUser(name,email,password);
            res.status(200).send(true);

        }
        else if (registerCredentials===true){
            res.status(200).send(false);
        }
        else if (registerCredentials==="server busy"){
            res.status(500).send(true);
        }
    }
    catch (e){

    }
    

})

module.exports = router;