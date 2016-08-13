'use strict';

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://neema:neema@localhost:5672',(err,conn)=>{
    if(err) throw err;
    conn.createChannel((err,ch)=>{
        if(err) throw err;
        ch.assertQueue('hello',{durable:true});
        console.log(" [*] Waiting for messages in hello. To exit press CTRL+C");
        ch.consume('hello',(msg)=>{
            let secs = msg.content.toString().split('.').length - 1;
            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(function() {
                console.log(" [x] Done");
            }, secs * 1000);
        },{noAck: true});
    })
});
// ./new_task.js 1 message
// ./new_task.js 2 message
// ./new_task.js 3 message
// ./new_task.js 4 message
// ./new_task.js 5 message