const mongoose = require('mongoose')

const dbConnection = async () => {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
    }).then(() => console.log("database connected successfully"))
        .catch((err) => console.log("error connecting to mongodb", err));
}

module.exports = dbConnection

