const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PinSchema = new Schema({
  title: String,
  desc: String,
  username: String,
  path: String,
  isSave: Boolean
})

module.exports = mongoose.model('pins',PinSchema);
