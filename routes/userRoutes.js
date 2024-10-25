const express = require('express')
const router = express.Router();

const { login, logout, promote, getuser, adminlogin } = require('../controllers/userController')

router.post("/login", login)
router.post("/logout", logout)
router.post("/promote", promote)

router.post("/getuser", getuser)

router.post("/admin/login", adminlogin )


module.exports = router;