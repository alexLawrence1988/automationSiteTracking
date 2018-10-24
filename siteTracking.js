const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const capture = require('./routes/capture.js');
const env = 'live';
const config = require('./config/config.' + env + '.js');

app.use('/tracking', capture);

app.listen(config.port, function(){
    console.log('Tracking service running on port: ' + config.port);
})
