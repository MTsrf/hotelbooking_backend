const express = require('express');
const { adminLogin, addCategory, deleteCategory, getCategory, updateCategory, getAllVendor, approveVendor, blockedVendor, unBlockVendor } = require('../controller/adminController');
const { verifyAdmin } = require('../middleware/verifyToken');
const router = express.Router();


router.post('/adminLogin',adminLogin)

router.post('/addCategory',verifyAdmin,addCategory)

router.post('/deleteCategory',verifyAdmin,deleteCategory)

router.get('/getAllCategory',verifyAdmin,getCategory)

router.put('/updateCategory/:id',verifyAdmin,updateCategory)

router.get('/getAllVendor',verifyAdmin,getAllVendor)

router.post("/approveVendor",verifyAdmin,approveVendor)

router.post('/blockedVendor',verifyAdmin,blockedVendor)

router.post('/unblockVendor',verifyAdmin,unBlockVendor)

module.exports = router