const mongoose = require('mongoose');

const ProfilePic = new mongoose.Schema({
    fileName:{
        type:String,
        required:true
    },
    filePath:{
        type:String,
        required:true
    },
    fileType:{
        type:String,
        required:true
    },
    fileSize:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

module.exports = mongoose.model('profilePics', ProfilePic);