var express = require('express');
var mailer = require('express-mailer');
var app = express();
var path = require('path');

app.set('views',  '/var/www/html/anjum-rest-apis/views');
app.set('view engine', 'ejs');

mailer.extend(app, {
    from: 'anjum@gmail.com',
    host: 'smtp.gmail.com', // hostname 
    secureConnection: true, // use SSL 
    port: 465, // port for secure SMTP 
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
    auth: {
        user: 'nodeteamemail@gmail.com',
        pass: 'promatics'
    }
});

exports.sendEmail = function(template, mailOptions, callback) {
    // Send email.
    app.mailer.send(template, mailOptions, function(err, message) {
        if (err) {
            console.log(err);
            callback('err', err);
            //res.send('There was an error sending the email');
            return;
        }else{
        	callback('success', message);
        }
        //return res.send('Email has been sent!');
    });
}