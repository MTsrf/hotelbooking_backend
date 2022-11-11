const express = require('express');
const { adminLogin, addCategory, deleteCategory, getCategory, updateCategory, getAllVendor, approveVendor, blockedVendor, unBlockVendor, bookedDetails, getUsers, deletUser, manageUser } = require('../controller/adminController');
const { verifyAdmin } = require('../middleware/verifyToken');
const router = express.Router();


router.post('/adminLogin', adminLogin)

router.post('/addCategory', verifyAdmin, addCategory)

router.post('/deleteCategory', verifyAdmin, deleteCategory)

router.get('/getAllCategory', verifyAdmin, getCategory)

router.put('/updateCategory/:id', verifyAdmin, updateCategory)

router.get('/getAllVendor', verifyAdmin, getAllVendor)

router.post("/approveVendor", verifyAdmin, approveVendor)

router.post('/blockedVendor', verifyAdmin, blockedVendor)

router.post('/unblockVendor', verifyAdmin, unBlockVendor)

router.get('/bookingList', verifyAdmin, bookedDetails)

router.get('/getAllUser', verifyAdmin, getUsers)

router.delete("/deleteUser/:id", verifyAdmin, deletUser)

router.put("/blockUser", verifyAdmin, manageUser)

module.exports = router