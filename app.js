const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')
const {readdirSync} = require('fs')

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

// const adminRoutes = require('./routes/admin')


readdirSync("./routes").map((item) => app.use("/", require("./routes/" +item)));

// app.use('/admin', adminRoutes)





//database
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser:true,
}).then(()=>console.log("database connected successfully"))
.catch((err)=>console.log("error connecting to mongodb",err));


const PORT = process.env.PORT || 5000

app.listen(PORT,(err,res)=>{
    if (err) {
        console.log('server is error');
    }else{
        console.log(`server is running ${PORT}`);
    }
})