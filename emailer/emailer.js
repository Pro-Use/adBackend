const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
       user: '096a4259ac0f07',
       pass: 'b7dab3b9d4d65e'
    }
});

exports.emailResponse = (add, type) => {
    if (type === 'displayed') {
        var subject = "Arrivals Departures: Name now live";
        var msg = "Your submitted name is now on the board";
    }
    const message = {
    from: 'info@arrivals-departures.com',
    to: add,         // List of recipients
    subject: subject, // Subject line
    text: msg // Plain text body
    };
    transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
    });
};