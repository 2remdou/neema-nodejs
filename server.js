'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
var io = require('socket.io')(server);
const _ = require('lodash');
var neemaSocket = null;


const jackrabbit = require('jackrabbit');
const rabbit = jackrabbit(process.env.RABBITURL);
const logger = require('logfmt');

var exchange = rabbit.topic('neema.exchange');

var ios = exchange.queue({name: 'ios',key: 'notification.ios' });
var android = exchange.queue({name: 'android',key: 'notification.android'});

exchange.queue({name:'event',key:'commande.*'})
        .consume(consumeEvent);


var apn = require('./services/ApnsNotification');
var gcm = require('./services/GcmNotification');
var RestaurantService = require('./services/RestaurantService')();

ios.consume(consumeIos);
android.consume(consumeAndroid);



io.on('connection',function(socket){
    neemaSocket = socket;
    neemaSocket.on('restaurant:registred',function(restaurant){
        console.log('new client');
        let rest = {id:restaurant.id,socket:{id:socket.id}};
        RestaurantService.add(rest);
        socket.join(rest);
    });

    neemaSocket.on('disconnect',function(){
        RestaurantService.remove(socket.id);
    });

});


function consumeEvent(data,ack){
    RestaurantService.findByRestaurant(data.restaurant.id).forEach((restaurant)=>{
        io.in(restaurant.socket.id).emit('commande:new');
        // neemaSocket.broadcast.to(restaurant.socket.id).emit('commande:new');
        // io.broadcast.to(restaurant.socket.id).emit('commande:new');
    })
    ack();
};

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

let port = process.env.PORT || 5000;

server.listen(port);