const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const handlebars = require('express-handlebars');
const path = require('path');

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
    if (type === 'displayed') {
        var subject = "Arrivals Departures: Name now live";
        var msg = "Your submitted name is now on the board";
    }
    const message = {
        from: 'info@arrivals-departures.com',
        to: add,         // List of recipients
        subject: subject, // Subject line
        template: 'base_email',
        text: msg,
        main_text: {
           name: msg
        }
    };
    transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
    });
};