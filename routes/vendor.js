const { vendor_registration, activateAccount, vendorLogin, getCategory, addHotel, getHotel, addRoom, addPhots, addLocation } = require('../controller/vendorController')
const { verifyVendor } = require('../middleware/verifyToken')
const imageUpload = require('../middleware/imageUpload')
const { uploadImage } = require('../controller/uploadController')
const router = require('express').Router()


router.post('/vendorSignup',vendor_registration)

router.post('/activateAccount',verifyVendor,activateAccount)

router.post('/loginVendor',vendorLogin)

router.post('/addHotel',verifyVendor,addHotel)

router.post('/addRoom',verifyVendor,addRoom)

router.post('/addLocation',verifyVendor,addLocation)

router.post('/addPhotos',verifyVendor,imageUpload,uploadImage)

router.get('/getCategory',verifyVendor,getCategory)

router.get('/getHotel/:id',verifyVendor,getHotel)



module.exports = router