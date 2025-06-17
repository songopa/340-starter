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

invCont.buildInvManagement = async function (req, res) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
    })
}

invCont.buildAddClassification = async function (req, res) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
    })
}


invCont.saveNewClassification = async function (req, res) {
    let nav = await utilities.getNav();
    const { classification_name } = req.body;
    const result = await invModel.saveNewClassification(classification_name);
    
    if (result) {
        req.flash("notice", "New classification added successfully.");
        res.status(201).redirect("/inv");
    } else {
        req.flash("notice", "Failed to add new classification.");
        res.status(501).render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
        });
    }
}


invCont.buildAddInventory = async function (req, res) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-inventory", {
        title: "Add New Inventory",
        classificationList: await utilities.buildClassificationList(),
        nav,
        errors: null,
    })
}

invCont.saveNewInventory = async function (req, res) {
    let nav = await utilities.getNav();
    const invData = req.body;
    const result = await invModel.saveNewInventory(invData);

    if (result) {
        req.flash("notice", "New inventory item added successfully.");
        res.status(201).redirect("/inv");
    } else {
        req.flash("notice", "Failed to add new inventory item.");
        res.status(501).render("./inventory/add-inventory", {
            title: "Add New Inventory",
            classificationList: await utilities.buildClassificationList(),
            nav,
            errors: null,
        });
    }
}

module.exports = invCont;