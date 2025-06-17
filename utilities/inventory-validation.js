const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
        // firstname is required and must be string
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a classification name."), // on error this message is sent.
    ]
}

/* ******************************
 * Check data and return errors or continue to saving classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const classification_name = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
    return [
        // inv_make is required and must be string
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a make for the vehicle."),
        // inv_model is required and must be string
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a model for the vehicle."),
        // inv_year is required and must be numeric
        body("inv_year")
            .notEmpty()
            .isNumeric()
            .withMessage("Please provide a year for the vehicle."),
        // inv_description is required and must be string
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 10 })
            .withMessage("Please provide a description for the vehicle."),
        // inv_price is required and must be numeric
        body("inv_price")
            .notEmpty()
            .isNumeric()
            .withMessage("Please provide a price for the vehicle."),
        // inv_miles is required and must be numeric
        body("inv_miles")
            .notEmpty()
            .isNumeric()
            .withMessage("Please provide miles for the vehicle."),
        // inv_color is required and must be string
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 , max: 10 })
            .withMessage("Please provide a color for the vehicle."),
    ]
}

validate.checkInventoryData = async (req, res, next) => {
    const invData = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Inventory",
            classificationSelect: await utilities.buildClassificationList(invData.classification_id),
            nav,
            invData,
        })
        return
    }
    next()
}

module.exports = validate