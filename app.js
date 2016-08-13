'use strict';

const express = require('express');
const app = express();
const apn = require('apn');


app.use(express.static('apn'));

app.get('/',(req,res)=>{
    let token = 'ff7cedc5c828b9721952b221896afc66d822d146c0d999cb5a9f2169af6febcb';
    let device = new apn.Device(token);
    const apnService = require('./services/ApnsService')(device);

    res.end();
});

app.listen(8080);