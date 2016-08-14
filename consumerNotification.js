'use strict';

const jackrabbit = require('jackrabbit');
const rabbit = jackrabbit(process.env.RABBITURL);
const logger = require('logfmt');

var exchange = rabbit.direct('notification');
var ios = exchange.queue({key: 'ios' });
var android = exchange.queue({key: 'android'});

var apn = require('./services/ApnsNotification');
var gcm = require('./services/GcmNotification');

ios.consume(consumeIos);
android.consume(consumeAndroid);

function consumeIos(data,ack){
    apn.push(data);
    ack();
};

function consumeAndroid(data,ack){
    gcm.push(data);
    ack();
}