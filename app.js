const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const dotenv = require('dotenv')
const {readdirSync} = require('fs')
const dbConnection = require('./config/db')

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.use(fileUpload({
    useTempFiles:true,
}))
dbConnection()

// const adminRoutes = require('./routes/admin')


readdirSync("./routes").map((item) => app.use("/", require("./routes/" +item)));

// app.use('/admin', adminRoutes)






const PORT = process.env.PORT || 5000

app.listen(PORT,(err,res)=>{
    if (err) {
        console.log('server is error');
    }else{
        console.log(`server is running ${PORT}`);
    }
})