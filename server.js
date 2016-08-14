'use strict';

const express = require('express');
const app = express();

const jackrabbit = require('jackrabbit');
const rabbit = jackrabbit(process.env.RABBITURL);
const logger = require('logfmt');

var exchange = rabbit.direct('notification');
var ios = exchange.queue({name: 'ios',key: 'ios' });
var android = exchange.queue({name: 'android',key: 'android'});

var apn = require('./services/ApnsNotification');
var gcm = require('./services/GcmNotification');

ios.consume(consumeIos);
android.consume(consumeAndroid);

function consumeIos(data,ack){
    console.log('push ios %s on %s',data.content,data.token);
    apn.push(data);
    ack();
};

function consumeAndroid(data,ack){
    console.log('push android %s on %s',data.content,data.token);
    gcm.push(data);
    ack();
}


app.listen(process.env.PORT || 5000);