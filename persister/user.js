var mongoose = require('mongoose');

/**
 * User 정보를 담기 위한 Mongo DB model
 * @name userModel
 */
var userModel = function () {

  var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    gender: String,
    address: String,
    role:Number
  });
  return mongoose.model('User', userSchema);
};
mongoose.set('debug', true);
module.exports = new userModel();