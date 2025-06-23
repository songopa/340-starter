const express = require("express");
const router = express.Router();
const utilities = require("../utilities/");
const inquiryController = require("../controllers/inquiryController");
const inquiryValidation = require("../utilities/inquiry-validation");

router.get("/",  utilities.handleErrors(inquiryController.buildContactUs));
router.post("/", 
    inquiryValidation.inquiryRules(), 
    inquiryValidation.checkInquiryData,
    utilities.handleErrors(inquiryController.saveNewInquiry)
);

module.exports = router;