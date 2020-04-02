const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const request = require('request');
const emailConfig = require("../config/email.config.js");
const { SocketLabsClient } = require('@socketlabs/email');

const client = new SocketLabsClient(emailConfig.ID, emailConfig.APIKEY);

var source = fs.readFileSync(path.resolve(__dirname, '../emails/base_email.handlebars'), 'utf8');
var template = Handlebars.compile(source);

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
        var message = {
            to: add,
            from: "info@arrivalsanddepartures.net",
            subject: subject,
            textBody: txt,
            htmlBody: template({main_text: msg}),
            messageType: 'basic'
        };
        client.send(message).then(
            (res) => {
                //Handle successful API call
                console.log(res);
            },
            (err) => {
                //Handle error making API call
                console.log(err);
        });
 
    });
};

exports.emailModeration = (name) => {
    var msg = 'Hi,<br><br> The name <strong>'+name+'</strong> has been entered and requires moderation. <br>' +
            'got to <a href="http://www.arrivalsanddepartures.net/moderation">'+
            'http://www.arrivalsanddepartures.net/moderation</a> to manually moderate.' +
            '<br><br>Arrivals + Departures Auto-Moderation';
    var message = {
            to: 'arrive2depart@gmail.com',
            from: "info@arrivalsanddepartures.net",
            subject: 'Arrivals+Departures: "'+ name + '" needs to be moderated',
            htmlBody: msg,
            messageType: 'basic'
        };
    client.send(message).then(
        (res) => {
            //Handle successful API call
            console.log(res);
        },
        (err) => {
            //Handle error making API call
            console.log(err);
    });
 
};