#!/usr/bin/env node
'use strict';

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://neema:neema@localhost:5672',(err,conn)=>{
    if(err) throw err;

    conn.createChannel((err,ch)=>{
        var msg = process.argv.slice(2).join(' ') || "Hello World!";
        if(err) throw err;
        ch.assertQueue('hello',{durable:true});
        ch.sendToQueue('hello',new Buffer(msg),{persistent:true});
        console.log(" [x] Sent '%s'", msg);
    });
    
});