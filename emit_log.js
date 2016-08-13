#!/usr/bin/env node
'use strict';

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://neema:neema@localhost:5672',(err,conn)=>{
    if(err) throw err;

    conn.createChannel((err,ch)=>{
        var msg = process.argv.slice(2).join(' ') || "Hello World!";
        if(err) throw err;
        ch.assertExchange('logs','fanout',{durable:false});
        ch.publish('logs','',new Buffer(msg));
        console.log(" [x] Sent %s", msg);
    });
    setTimeout(()=>{conn.close();process.exit(0);},500);
});