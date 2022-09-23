// require('dotenv').config();
const mongoose = require('mongoose');

module.exports=()=>{
    mongoose.connect(`mongodb+srv://navneetfw14:Navnee7250@cluster0.iowwj.mongodb.net/realtimechat?retryWrites=true&w=majority`);
}