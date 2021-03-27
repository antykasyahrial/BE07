const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var userSchema = new Schema({
    
    username:  {
        type: String,
        required: true,
        unique: true
    },
    password:  {
        type: String,
        required: true
    },
    
}, {
    timestamps: true
});



var Users = mongoose.model('User', userSchema);

module.exports = Users;
