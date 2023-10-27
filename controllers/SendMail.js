const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
});

function sendMail (toEmail,subject,content){
    const mailOptions = {
        from:"personalcse475@gmail.com",
        to:toEmail,
        subject:subject,
        html:content
    }

    transporter.sendMail(mailOptions,(error,info)=>{
        if (error){
            console.log(`error is: ${error}`)
        }
        else{
            console.log(`mail sent: ${info.response}`);
        }
    })
}

module.exports = {sendMail};