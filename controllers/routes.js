const express = require('express')

const router = express.Router()

router.get('/', async (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer'))
    return res.status(400).send('No Token')
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { id } = decoded
    const user = await User.findById(id)
    return res
      .status(200)
      .send({
        profile_pic: user.profile_pic.filePath,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        email: user.email,
        dob: user.dob,
        languages: user.languages,
        gender: user.gender,
        token:token
      })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
