const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: "wheelstogether@outlook.com",
        pass: "Neekucheppanu"
    }
});

const options = {
    from: "wheelstogether@outlook.com",
    to: "gopivarun1234@gmail.com",
    subject: "Sending and checking",
    text: "Hello idiot"
};

transporter.sendMail(options,function(err,info){
    if(err){
        console.log(err);
        return;
    }
    console.log("Sent:" + info.response);
})