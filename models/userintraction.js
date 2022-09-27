const mongoose = require("mongoose");


const chatSchema = new mongoose.Schema(
  {
    user_id:{type:mongoose.Types.ObjectId, ref:'users', index:true},
    chats:[{type:Object}],
    requests:[{type:mongoose.Types.ObjectId, ref:'bots'}]
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("chats", chatSchema);