const express = require('express');
const { getdata, updatecarddata, updatecommondata, getCollege, getDept, addcarddata } = require('../controllers/commonController');
const router = express.Router();



router.get("/getcommon", getdata)
router.post("/updatecards", addcarddata);
router.post("/admin/updatecards", updatecarddata);
router.post("/updatecommon", updatecommondata);
// router.post("/logout",logout)

router.get("/getcollege", getCollege);
router.get("/getdept", getDept);


module.exports = router;