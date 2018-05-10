var mongoose = require('mongoose');

/**
 * User 정보를 담기 위한 Mongo DB model
 * @name userModel
 */
var timeslotModel = function () {

  var  timeslotSchema = mongoose.Schema({
    allotment: String,
    password: String,
    email: String,
    gender: String,
    address: String,
    startTime: Date,
    endTime: Date,
  });
 

  return mongoose.model('TimeSlot',  timeslotSchema);
};

module.exports = new timeslotModel();