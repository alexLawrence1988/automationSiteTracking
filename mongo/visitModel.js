var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var visitSchema = new Schema({
  clientId: Number,
  visitId: Number,
  startDateTime: { type: Date, required: true, unique: true },
  endDateTime: { type: Date, required: true },
  pages: Object,  
  ipAddress: String,
  device: {
    screen: {
        w: Number,
        h: Number
    },
    browser: String,
    agent: String,
    os: String,
    language: String
  },
  domain: String,
  created_at: Date,
  updated_at: Date,
  guid: String,
  captureType: String
});

var visit = mongoose.model('visit', visitSchema);

module.exports = visit;