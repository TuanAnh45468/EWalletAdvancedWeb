const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require('../models/user')

const imageSchema = new Schema({
    frontImage: String,
    backImage: String,
    users: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

module.exports = mongoose.model('Image', imageSchema);