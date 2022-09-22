const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema(
  {
    profile_pic: {type:Object},
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone: {type: Number, required:true, unique:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    dob: {type:String, required: true},
    languages: [{ type: String, required:true}],
    gender: {type: String, required:true}
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 8);
  return next();
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("users", userSchema);