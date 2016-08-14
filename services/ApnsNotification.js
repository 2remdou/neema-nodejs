'use strict';

const apn = require('apn');
const logger = require('logfmt');


var notification = new apn.Notification();
let options = {
    production: true,
    passphrase: process.env.PASSPHARE_APNS
};

var apnsConnection = new apn.Connection(options);


var   ApnsNotification = {

    init : ()=>{
        notification.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        notification.badge = 3;
        notification.sound = "ping.aiff";

        apnsConnection.on("connected", function() {
            console.log("Connected");
        });

        apnsConnection.on("transmitted", function(notification, device) {
            console.log("Notification transmitted to:" + device.token.toString("hex"));
        });

        apnsConnection.on("transmissionError", function(errCode, notification, device) {
            console.error("Notification caused error: " + errCode + " for device ", device, notification);
            if (errCode === 8) {
                console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
            }
        });

        apnsConnection.on("timeout", function () {
            console.log("Connection Timeout");
        });

        apnsConnection.on("disconnected", function() {
            console.log("Disconnected from APNS");
        });

        apnsConnection.on("socketError", console.error);

    },

    push : (message) =>{
        notification.alert = message.content;

        apnsConnection.pushNotification(notification,message.token);
    },

}

module.exports = ApnsNotification;