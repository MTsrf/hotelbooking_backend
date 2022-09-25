const express = require('express');
const { adminLogin } = require('../controller/adminController');
const router = express.Router();


router.post('/adminLogin',adminLogin)


module.exports = router