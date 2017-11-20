var mongoose = require('mongoose');
var Group = require('./groups.js');
var User = require('./groups.js');
var Schema = mongoose.Schema;

var AppSchema = new Schema({
    applicationTitle: {
    type: String,
    required: true
  },
  group : [ { 
    type: String,
     ref: 'Group',
   } ],
   user : [ { 
    type: String,
     ref: 'User',
   } ]
});

var Application = mongoose.model('Application', AppSchema);

module.exports = Application;