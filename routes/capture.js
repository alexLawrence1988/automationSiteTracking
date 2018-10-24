'use strict';

const express = require('express');
const router = express.Router();
const ipware = require('ipware')().get_ip;

router.get('/capture', function(req, res){
    let ipInfo = ipware(req);
    

    console.log('Capturing visit info.');
    res.json({success: true, message: JSON.stringify(ipInfo)});
});

module.exports = router;

  