const express = require('express');
const cors = require('cors');
const path = require('path');
const connect = require('./config/db');
const authController = require('./controllers/user.controller');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/', authController)

app.listen(port, async()=>{
    try {
        await connect();
        console.log(`running on port ${port}...`)
    } catch (error) {
        console.log(error.message);
    }
})