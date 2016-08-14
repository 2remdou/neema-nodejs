'use strict';

const amqp = require('amqplib/callback_api');
var apn = require('./services/ApnsNotification');
var gcm = require('./services/GcmNotification');

amqp.connect(process.env.RABBITURL,(err,conn)=>{
    conn.createChannel((err,ch)=>{
        let exchange = 'notification';
        
        apn.init();
        gcm.init();
        ch.assertExchange(exchange,'direct',{durable:true});
        
        ch.assertQueue('ios',{durable:true},(err,q)=>{
            ch.bindQueue(q.queue,exchange,'ios');

            ch.consume(q.queue,(msg)=>{
                let message = JSON.parse(msg.content.toString());
                apn.push(message);

                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                ch.ack(msg);
            },{noAck:false});
        });

        ch.assertQueue('android',{durable:true},(err,q)=>{
            ch.bindQueue(q.queue,exchange,'android');

            ch.consume(q.queue,(msg)=>{
                let message = JSON.parse(msg.content.toString());
                gcm.push(message);

                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                ch.ack(msg);
            },{noAck:false});
        });

    });
});