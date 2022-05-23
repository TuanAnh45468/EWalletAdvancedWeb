const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    username: String,
    password: String,
    state: {
        type: String,
        enum: ['validated', 'notValidated']
    },
    failureTime: Number
})

module.exports = mongoose.model('Account', accountSchema);