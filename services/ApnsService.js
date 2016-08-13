'use strict';
const apn = require('apn');


function ApnsService(device,message){
    let notification = new apn.Notification();

    notification.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    notification.badge = 3;
    notification.sound = "ping.aiff";
    notification.alert = message;
    notification.payload = {'messageFrom': 'Caroline'};

    let options = {
        production: true,
        passphrase: 'ToureNeema2016'
    };

    var apnsConnection = new apn.Connection(options);

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

    apnsConnection.pushNotification(notification, device);

}

module.exports = ApnsService;
