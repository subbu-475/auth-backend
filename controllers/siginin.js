const User = require('../models/users');
const mongoose = require('mongoose');
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const VerifyUser = require('../models/verifyUser')
const {sendMail} = require('./SendMail');
const dotenv = require('dotenv');
const verifyUser = require('../models/verifyUser');
dotenv.config();


async function InsertVerifyUser(name,email,password){
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const token = generateToken(email);

        const newUser = new VerifyUser({
            name:name,
            email:email,
            password:hashedPassword,
            token:token
        })

        const activationLink=`https://authentication-page.onrender.com/${token}`;
        //console.log(activationLink);
        const content = `<h4>hi,there</h4>
        <h5>welcome to the app</h5>
        <p>Thank you for signing up.Click on the below link to activate</p>
        <a href="${activationLink}">click here</a>
        <p>regards</p>
        <p>Team</p>`

        await newUser.save();
        sendMail(email,"Verfiyuser",content);
    }
    catch (e) {
        console.log((e));
    }
     
}

function generateToken(email){
    const token = jwt.sign(email,process.env.SIGNIN_SECRET_TOKEN);
    return token
}

async function InsertSignupUser (token){
    const userVerify = await VerifyUser.findOne({token:token});
    try{
        if (userVerify){
            const newUser = new User({
                name:userVerify.name,
                email:userVerify.email,
                password:userVerify.password,
                token:userVerify.token,
                forgetPassword:{}
            });
    
            await newUser.save();
            await userVerify.deleteOne({token:token});
            const content = `<h4>Registeration successfull</h4>
            <h5>welcome to the app</h5>
            <p>You are successfully registered</p>
            <p>regards</p>
            <p>Team</p>`;
            sendMail(newUser.email,"Registeration successfull",content);
            return `<h4>Registeration successfull</h4>
            <h5>welcome to the app</h5>
            <p>You are successfully registered</p>
            <p>regards</p>
            <p>Team</p>`;
        }
        return`<h4>Registeration failed</h4>
            <h5>welcome to the app</h5>
            <p>Link expired</p>
            <p>regards</p>
            <p>Team</p>`;
    }
    catch (e){
        console.log(e);
        return`
        <html>
        <body>
        <h4>Registeration failed</h4>
        <h5>welcome to the app</h5>
        <p>Link expired</p>
        <p>regards</p>
        <p>Team</p>
        </body>
        </html>`;
    }
    
}

module.exports = {InsertVerifyUser,InsertSignupUser}