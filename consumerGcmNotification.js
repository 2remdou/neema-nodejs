'use strict';

const amqp = require('amqplib/callback_api');
const gcm = require('node-gcm');

// amqp.connect('amqp://guest:guest@localhost:5672',(err,conn)=>{
amqp.connect('amqp://zbtomucq:OXknMfWzifpEGpV-wW1vNuqYsCWG8Tgz@reindeer.rmq.cloudamqp.com/zbtomucq',(err,conn)=>{
    conn.createChannel((err,ch)=>{
        let exchange = 'notification';
        ch.assertExchange(exchange,'direct',{durable:true});
        
        ch.assertQueue('android',{durable:true},(err,q)=>{
            ch.bindQueue(q.queue,exchange,'android');

            ch.consume(q.queue,(msg)=>{
                let message = JSON.parse(msg.content.toString());
                let messageGcm = new gcm.Message();

                messageGcm.addNotification('title', 'Info);
                messageGcm.addNotification('body', message.message);
                messageGcm.addNotification('icon', 'ic_launcher');


                let sender = new gcm.Sender('AIzaSyClx0cB0L12aCxz3nSPzeO2wQf9fzx-E7I');
                let regTokens = [message.token];
                sender.send(messageGcm, { registrationTokens: regTokens },(err, response)=>{
                    if(err) throw err;
                    else 	console.log(response);
                });

                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                ch.ack(msg);
            },{noAck:false});
        });

    });
});