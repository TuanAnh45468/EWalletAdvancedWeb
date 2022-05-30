const { number } = require('joi');
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
        enum: ['validated', 'notValidated', 'locked', 'disabled']
    },

    failureTime: Number,
    
    date: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        default: "USER"
    },

    history: [{
        transactionType: {
            type: String,
            enum: ['creditCard', 'mobileCard', 'null'],
            default: 'null'
        },
        money: {
            type: Number,
            default: 0
        },
        transactionTime: Date,
        state: {
            type: String,
            enum: ['done', 'waiting', 'canceled', 'null'],
            default: "null"
        },
    }]
})

//accountSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('Account', accountSchema);