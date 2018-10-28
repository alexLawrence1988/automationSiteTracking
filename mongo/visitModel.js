var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

// create a schema
var visitSchema = new Schema({
  clientId: Number,
  startDateTime: { type: Number, required: true}, // lets store these as epochs
  endDateTime: { type: Number, required: true }, // lets store these as epoch
  pages: Array,  
  ipAddress: String,
  device: {
    screen: String,
    browser: String,
    agent: String,
    os: String,
    language: String
  },
  domain: String,
  created_at: Number, // lets store these as epochs
  updated_at: Number, // lets store these as epochs
  guid: String,
  fingerprint: String,
  captureType: String
});

var visit = mongoose.model('visit', visitSchema);

module.exports = visit;