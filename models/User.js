const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  idemail: {type: String, required: true},
  password: {type: String, required: true},
  name: {type: String, required: true},
  phone: {type: String, required: true}
});

module.exports = mongoose.model('users', userSchema);
