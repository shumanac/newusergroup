var mongoose = require('mongoose');
var User = require('./user.js');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
  groupTitle: {
    type: String,
    required: true
  },
  users : [ { type: Schema.Types.ObjectId, ref: 'User',  index: true } ]
});

var Group = mongoose.model('Group', GroupSchema);

module.exports = Group;