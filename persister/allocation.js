var mongoose = require('mongoose');

/**
 * User 정보를 담기 위한 Mongo DB model
 * @name userModel
 */
var allocationModel = function () {
    var allocationSchema = mongoose.Schema({
        allotment_name: String,
        value: String,
        created_date: {
            type: Date,
            default: Date.now
        }
    });

    return mongoose.model('Allocation', allocationSchema);
};

module.exports = new allocationModel();