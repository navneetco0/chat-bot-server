const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User.model')
const bcrypt = require("bcryptjs");
const upload = require('../helpers/filehelper');
const router = express.Router()


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
  const token = authHeader.split(' ')[1];
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
      token: token,
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

router.patch('/', upload.single('file'), async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer'))
    return res.status(400).send('No Token')
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { id } = decoded
    console.log(req.file)
    let user = await User.findById({_id:id});

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
        return res.status(200).send('profile picture updated successfully.')
    //   } 
    // else 
    // if (req.body.profile) {
    //     user = await User.findByIdAndUpdate({ _id: id }, req.body.profile, {
    //       new: true,
    //     })
      } else if (req.body.mng_password) {
        const match = user.checkPassword(req.body.mng_password.current_password)

        if (!match)
          return res.status(400).send({ message: 'Password is incorrect.' })

        user = await User.findByIdAndUpdate(
          { _id: id },
          { password: bcrypt.hashSync(req.body.mng_password.new_password, 8) },
          { new: true },
        );
        return res.send('updated successfully')
      }
    }
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router
