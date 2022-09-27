const mongoose = require('mongoose');

const BotSchema = new mongoose.Schema({
   text:{type:String},
   ans:[{type:Object}]
},{
    timestamps:true
})
module.exports = mongoose.model('Bots', BotSchema);