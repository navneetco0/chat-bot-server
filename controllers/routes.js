const express = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const upload = require('../helpers/filehelper')
const singleFile = require('../models/profilepic')
const Bot = require('../models/bot.model');
const router = express.Router();
const Chats = require('../models/userintraction')
const { brotliCompressSync } = require('zlib')

const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return '0 Bytes'
  }
  const dm = decimal || 2
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB']
  const index = Math.floor(Math.log(bytes) / Math.log(1000))
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + '-' + sizes[index]
  )
}

router.post('/', async (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer'))
    return res.status(400).send('No Token')
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { id } = decoded
    const user = await User.findById(id)
    return res.status(200).send({
      id: user._id,
      profile_pic: user.profile_pic.filePath,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      email: user.email,
      dob: user.dob,
      languages: user.languages,
      gender: user.gender,
      type: user.type,
      token: token,
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

router.patch('/', upload.single('file'), async (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer'))
    return res.status(400).send('No Token')
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { id } = decoded
    let user = await User.findById({ _id: id })
    if (user) {
      if (req.file) {
        fs.unlink(user.profile_pic.filePath, (error) => {
          console.log(error)
        })
        const file = new singleFile({
          fileName: req.file.originalname,
          filePath: req.file.path,
          fileType: req.file.mimetype,
          fileSize: fileSizeFormatter(req.file.size, 2),
        })
        user = await User.findByIdAndUpdate(
          { _id: id },
          { profile_pic: file },
          { new: true },
        )
        return res.send('profile picture updated successfully.')
      } else if (req.body.languages) {
        user = await User.findByIdAndUpdate({ _id: id }, req.body, {
          new: true,
        })
        res.send('updated successfully')
      } 
      else if(req.body.data){
        user = await User.findByIdAndUpdate(
            {_id:id},
            req.body.data,
            {new:true}
        )
        res.send('update successfully.')
      }
      else if (req.body.mng_password) {
        const match = user.checkPassword(req.body.mng_password.current_password)

        if (!match)
          return res.status(400).send({ message: 'Password is incorrect.' })

        user = await User.findByIdAndUpdate(
          { _id: id },
          { password: bcrypt.hashSync(req.body.mng_password.new_password, 8) },
          { new: true },
        )
        return res.send('updated successfully')
      }
    }
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/bot', async(req, res)=>{
  try {
    const bot = await Bot.create(req.body);
    return res.send(bot);
  } catch (error) {
    console.log(error)
  }
});

router.post('/min', async(req, res)=>{
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer'))
     return res.status(400).send('No Token')
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;
    if(id==='6332bfb3540ee2196ebaf850'){
      const users = await User.find({type:'normal'}).lean().exec();
      res.status(200).send(users);
    }
    else
      res.status(200).send('you are not authorized person')
    
  } catch (error) {
    res.status(500).send(error);
  }
})

router.post('/chats', async(req, res)=>{
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer'))
     return res.status(400).send('No Token');
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;
    const user = await User.findById(id).lean().exec();
    if(user){
      let bot = await Bot.findById(req.body.id).lean().exec();
      let chats = await Chats.find({user_id:id}).lean().exec();
      console.log(chats.chats);
       let chat = [...chats.chats, req.body.input, bot?req.body.id:'I am in learning phase, please go through option. please type menu for menu'];
       console.log(chat)
       await Chats.findByIdAndUpdate({_id:chats._id}, {chats:chat}, {new:true});
      return res.send('successfull');
    }
    else return res.send('invalid credentials.')
  } catch (error) {
    res.status(500).send(error);
  }
})

module.exports = router
