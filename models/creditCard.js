const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const creditCardSchema = new Schema({
    number: String,
    cvv: Number,
    expireDate: Date,
})

module.exports = mongoose.model('CreditCard', creditCardSchema);