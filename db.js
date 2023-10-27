const mongoose=require('mongoose');
const dotenv=require('dotenv');

dotenv.config();

const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("mongo db connected successfully");
    }
    catch(error){
        console.log(error)
    }
}

module.exports = connectDb;