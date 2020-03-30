const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const handlebars = require('express-handlebars');
const path = require('path');
const request = require('request');

viewEngine = handlebars.create({
    partialsDir: 'emails/',
    defaultLayout: false
});

sut = hbs({
    viewEngine: viewEngine,
    viewPath: 'emails/'
});

let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
       user: '096a4259ac0f07',
       pass: 'b7dab3b9d4d65e'
    }
});

transport.use('compile', sut);

exports.emailResponse = (add, type) => {
    var URL = "http://134.209.184.8/email_text/"+ type;
    request.get(URL, (err, res, body) => {
        if(err) {
            console.log(err);
            return;
        }else if (body === 'null') {
            console.log(type + " is not an email type");
            return;
        } 
        var results = JSON.parse(body);
        var subject = results['subject'];
        var msg = results['text']['value'];
        var txt = results['plain_text'];
        console.log('subject:' + subject + '\n msg:' + msg);
        const message = {
            from: 'info@arrivals-departures.com',
            to: add,         // List of recipients
            subject: subject, // Subject line
            template: 'base_email',
            text: txt,
            context: {
               main_text: msg
            }
        };
        transport.sendMail(message, function(err, info) {
            if (err) {
              console.log(err);
            } else {
              console.log(info);
            }
        });  
    });
};