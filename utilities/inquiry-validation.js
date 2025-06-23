const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


/*  **********************************
  *  Inquiry Data Validation Rules
  * ********************************* */
validate.inquiryRules = () => {
    return [
        // inquirer_name must be string
        body("inquiry_name")
            .trim()
            .escape()
            .isLength({ min: 3 })
            .withMessage("Please provide your fullnames."),
        // email is required and must be valid email
        body("inquiry_email")
            .trim()
            .escape()
            .isEmail()
            .withMessage("Please provide a valid email address."),
        // inquiry_purpose is required and must be string
        body("inquiry_purpose")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a purpose for your inquiry."),
        // inquiry_text is required and must be string
        body("inquiry_text")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 10 })
            .withMessage("Please provide a message for your inquiry."),
    ]
}

/* ******************************
 * Check data and return errors or continue to saving inquiry
 * ***************************** */
validate.checkInquiryData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.locals.inquiry_emails = req.body.inquiry_email
        res.locals.inquiry_name = req.body.inquiry_name
        res.locals.inquiry_purpose = req.body.inquiry_purpose
        res.locals.inquiry_text = req.body.inquiry_text
        res.render("./inquiry/inquiry", {
            title: "Contact Us",
            errors,
            nav,
        })
        return
    }
    next()
}


module.exports = validate