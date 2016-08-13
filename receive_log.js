'use strict';

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://neema:neema@localhost:5672',(err,conn)=>{
    if(err) throw err;
    conn.createChannel((err,ch)=>{
        if(err) throw err;
        ch.assertExchange('logs','fanout',{durable:false});
        ch.assertQueue('',{exclusive:true},(err,q)=>{
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            if(err) throw err;
            ch.bindQueue(q.queue,'logs','');

            ch.consume(q.queue,(msg)=>{
                console.log(" [x] %s", msg.content.toString());
            },{noAck:true});
        });
    });
});