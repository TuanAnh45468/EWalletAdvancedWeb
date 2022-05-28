const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const accountSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },

    password: {
        type: String,
        require: true
    },

    state: {
        type: String,
        enum: ['validated', 'notValidated']
    },

    failureTime: Number,
    
    date: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        default: "USER"
    }
})

//accountSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('Account', accountSchema);