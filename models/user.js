const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Account = require('../models/account')

const userSchema = new Schema({
    name: String,
    email: String,
    balance: {
        type: Number,
        min: [0, 'Money must greater than 0']
    },
    phoneNumber: String,
    birthday: Date,
    address: String,
    accounts: [{type: Schema.Types.ObjectId, ref: 'Account'}]
});

module.exports = mongoose.model('User', userSchema);