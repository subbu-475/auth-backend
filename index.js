const express = require('express');
const connectDb=require('./db');
const signinRoutes = require('./routes/signin');
const loginRoutes = require('./routes/login');
const homeRoutes = require('./routes/home');
const cors = require('cors');
const app = express();
const port = 4000;
app.use(express.json());
app.use(cors({origin:"*"}));
connectDb();
app.get('/',(req,res)=>{
    res.send("it is ready to bow!")
})

app.use('/signin',signinRoutes);
app.use('/login',loginRoutes);
app.use('/home',homeRoutes);

app.listen(port,()=>{
    console.log(`The server running on the port number ${port}`)
})