const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const client = require('../redis');
dotenv.config();

async function CheckUser(email){
    try{
        const user = await User.findOne({email:email});
        if (user) {
            return true;
        }
        else{
            return false;
        }
    }
    catch(e){
        return "server busy"
    }
}

async function AuthenticateUser (email,password) {
    try{
       const userCheck = await User.findOne({email:email});
       const validPassword = await bcrypt.compare(password,userCheck.password);
       if (validPassword) {
        const token = jwt.sign({email},process.env.LOGIN_SECRET_TOKEN)
        const response = {
            id:userCheck._id,
            name:userCheck.name,
            email:userCheck.email,
            token:token,
            status:true
        }
        //for stay in session use redis
        await client.set(`key-${email}`,JSON.stringify(response));
        
        await User.findOneAndUpdate({email:userCheck.email},{$set:{token:token}},{new:true});
        return response;
       }
       return "Invalid User name or Password"
    }
    catch (error){
        console.log(error);
        return "server busy"
    }
}

async function AuthorizeUser (token) {
    try{
        const decodedToken = jwt.verify(token,process.env.LOGIN_SECRET_TOKEN);
        console.log(decodedToken);
        if(decodedToken){
            const email = decodedToken.email;
            const auth = await client.get(`key-${email}`);
            console.log(auth);
            if (auth) {
                const data = JSON.parse(auth);
                console.log(data);
                return data;
            }
            else {
                const data = User.findOne({email:email});
                return data;
            }
        }
        return false;
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {CheckUser,AuthenticateUser,AuthorizeUser};