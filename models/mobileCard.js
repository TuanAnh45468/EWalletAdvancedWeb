const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const mobileCardSchema = new Schema({
    number: String,
    name: String,
    type: {
        type: String,
        enum: ['10k', '20k', '50k', '100k']
    }
})

module.exports = mongoose.model('MobileCard', mobileCardSchema);