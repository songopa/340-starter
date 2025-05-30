const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 *  Build vehicle details view
 * ************************** */
invCont.buildVehicleDetails = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getVehicleById(inv_id)
    const detailView = await utilities.buildVehicleDetails(data)
    let nav = await utilities.getNav()
    if (data) {
        res.render("./inventory/vehicle", {
            title: data.inv_make + " " + data.inv_model + " details",
            nav,
            detailView,
        })
    } else {
        next({ status: 404, message: "Sorry, no vehicle found with that ID." })
    }
}
module.exports = invCont;