'use strict';

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://neema:neema@localhost:5672',(err,conn)=>{
    if(err) throw err;
    conn.createChannel((err,ch)=>{
        if(err) throw err;
        ch.assertQueue('hello',{durable:false});
        
        setInterval(()=>{
            ch.sendToQueue('hello',new Buffer('Hello World!'+ Math.round(Math.random()*20)));
        },3000);
        console.log(" [x] Sent 'Hello World!'");
    })
})
