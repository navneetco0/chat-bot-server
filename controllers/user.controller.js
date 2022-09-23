const express = require('express')
require('dotenv').config()
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')
const singleFile = require('../models/profilepic')

const fileSizeFormatter = (bytes, decimal)=>{
  if(bytes===0){
      return '0 Bytes';
  }
  const dm = decimal || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
  const index = Math.floor(Math.log(bytes)/Math.log(1000));
  return parseFloat((bytes/Math.pow(1000, index)).toFixed(dm))+'-'+sizes[index]
}

const login =  async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(400)
        .send({ message: 'Either Email or Password is incorrect' })

    const match = User.checkPassword(req.body.password)

    if (!match)
      return res
        .status(400)
        .send({ message: 'Either Email or Password is incorrect' })

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '900s' },
    );

    return res.status(201).send({ 
        profile_pic: user.profile_pic,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        email: user.email,
        dob: user.dob,
        languages: user.languages,
        gender: user.gender,
      token })
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}

const register = async (req, res) => {
    try {
      let user =
      (await User.findOne({ email: req.body.email })) ||
      (await User.findOne({ phone: req.body.phone }))
      
      const file = new singleFile({
        fileName:req.file.originalname,
        filePath:req.file.path,
        fileType:req.file.mimetype,
        fileSize:fileSizeFormatter(req.file.size, 2)
      });
      
      if (user?.phone)
        return res
          .status(208)
          .send({
            message:
              'phone no. is already regestered with another user. please provide another phone no..',
          })
      if (user?.email)
        return res
          .status(208)
          .send({
            message:
              'email is already registered. either enter another email or forgot password.',
          })
      user = await User.create({
        profile_pic: file,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        dob: req.body.dob,
        languages: req.body.languages,
        gender: req.body.gender,
      })
      let token
      if (user)
        token = jwt.sign(
          { id: user._id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: '900s' },
        )
      return res.status(201).send({ token })
    } catch (err) {
      return res.status(500).send({ message: err.message })
    }
  }

module.exports = {login, register}
