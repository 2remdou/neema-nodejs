'use strict';

const amqp = require('amqplib/callback_api');
const apn = require('apn');

// amqp.connect('amqp://guest:guest@localhost:5672',(err,conn)=>{
amqp.connect('amqp://zbtomucq:OXknMfWzifpEGpV-wW1vNuqYsCWG8Tgz@reindeer.rmq.cloudamqp.com/zbtomucq',(err,conn)=>{
    conn.createChannel((err,ch)=>{
        let exchange = 'notification';
        ch.assertExchange(exchange,'direct',{durable:true});
        
        ch.assertQueue('ios',{durable:true},(err,q)=>{
            ch.bindQueue(q.queue,exchange,'ios');

            ch.consume(q.queue,(msg)=>{
                let message = JSON.parse(msg.content.toString());
                require('./services/ApnsService')(new apn.Device(message.token),message.message);

                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                ch.ack(msg);
            },{noAck:false});
        });

    });
});