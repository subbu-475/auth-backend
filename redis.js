const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();

const redisClient = () => {
    return redis.createClient()
}

const client = redisClient();

client.on("error",(err)=>{
    console.log(err);
})

client.on("connect",()=>{
    console.log("connected to redis");
})

client.on("end",()=>{
    console.log("redis connection end");
})

process.on("SIGQUIT", () => {
    client.quit(() => {
        console.log("Redis client has been gracefully disconnected.");
    });
});

module.exports = client;