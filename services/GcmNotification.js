'use strict';

const gcm = require('node-gcm');

var messageGcm = new gcm.Message();
var sender = new gcm.Sender(process.env.GOOGLE_API_KEY);

var GcmNotification = {
    init : ()=>{
        messageGcm.addNotification('title', 'Info');
        messageGcm.addNotification('icon', 'ic_launcher');
    },

    push : (message) =>{

        messageGcm.addNotification('body', message.content);

        sender.send(messageGcm, { registrationTokens: [message.token] },(err, response)=>{
            if(err) throw err;
            else 	console.log(response);
        });
    }
}

module.exports = GcmNotification;