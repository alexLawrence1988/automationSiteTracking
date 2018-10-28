'use strict'
let mongoose = require('mongoose');
let config = require('../config/config.live')
const server = config.mongoConn; // REPLACE WITH YOUR DB SERVER
const database = 'pastrytest';      // REPLACE WITH YOUR DB NAME

class Database {
  constructor() {
    this._connect()
  }

_connect() {
     mongoose.connect(`mongodb://${server}/${database}`, {useNewUrlParser: true} )
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}
module.exports = new Database()