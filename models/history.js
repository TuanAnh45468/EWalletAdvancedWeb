const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user')

const historySchema = new Schema({
    type: String,
    money: Number,
    time: Date,
    state: {
        type: String,
        enum: ['done', 'waiting']
    },
    users: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

module.exports = mongoose.model('History', historySchema);