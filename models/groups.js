var mongoose = require('mongoose');
var User = require('./user.js');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
  group: {
    type: String,
    required: true
  },
  users : [ {
     type: String,
     ref: 'User'} ]
});

var Group = mongoose.model('Group', GroupSchema);

module.exports = Group;