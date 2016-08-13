'use strict';

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://neema:neema@localhost:5672',(err,conn)=>{
    if(err) throw err;
    conn.createChannel((err,ch)=>{
        if(err) throw err;
        ch.assertQueue('hello',{durable:false});
        console.log(" [*] Waiting for messages in hello. To exit press CTRL+C");
        ch.consume('hello',(msg)=>{
            console.log(" [x] Received %s", msg.content.toString());
        },{noAck: true});
    })
});