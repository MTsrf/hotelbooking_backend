const { vendor_registration, activateAccount, vendor_login } = require('../controller/vendorController')

const router = require('express').Router()


router.post('/vendor_signup',vendor_registration)

router.post('/activate_account',activateAccount)

router.post('/login_vendor',vendor_login)

module.exports = router