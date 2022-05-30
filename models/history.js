const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user')

const historySchema = new Schema({
    type: {
        type: String,
        enum: ['creditCard', 'mobileCard', 'null'],
        default: 'null'
    },
    money: Number,
    time: Date,
    state: {
        type: String,
        enum: ['done', 'waiting', 'canceled', 'null'],
        default: "null"
    },
    accounts: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

module.exports = mongoose.model('History', historySchema);