const utilities = require("../utilities/");
const inquiryModel = require("../models/inquiry-model");

const inquiryController = {};

inquiryController.buildContactUs = async function (req, res) {
    let nav = await utilities.getNav();
    res.render("./inquiry/inquiry", {
        title: "Contact Us",
        nav,
        errors: null,
    });
};


inquiryController.saveNewInquiry = async function (req, res) {
    let nav = await utilities.getNav();
    const inquiryData = req.body;
    const result = await inquiryModel.saveNewInquiry(inquiryData);
    if (result) {
        req.flash("notice", "Your inquiry has been submitted successfully.");
        res.status(201).redirect("/contact-us");
    } else {
        res.locals.inquiry_emails = req.body.inquiry_email
        res.locals.inquiry_name = req.body.inquiry_name
        res.locals.inquiry_purpose = req.body.inquiry_purpose
        res.locals.inquiry_text = req.body.inquiry_text
        req.flash("notice", "Failed to submit your inquiry. Please try again.");
        res.status(501).render("./inquiry/inquiry", {
            title: "Contact Us",
            nav,
            errors: null,
        });
    }
}


module.exports = inquiryController;