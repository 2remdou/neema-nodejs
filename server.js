'use strict';

const express = require('express');
const app = express();
const amqp = require('amqplib/callback_api');


app.get('/',(req,res)=>{
    amqp.connect('amqp://localhost',(err,conn)=>{
        if(err) throw err;
        conn.createChannel((err,ch){
            if(err) throw err;
            ch.assertQueue('hello',{durable:false});
            ch.sendToQueue('hello',Buffer.from('Hello World!'));
            console.log(" [x] Sent 'Hello World!'");
        })
    })
});

app.listen(8080);