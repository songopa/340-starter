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
    const classificationSelect = await utilities.buildClassificationList()

    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        classificationSelect,
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
        classificationSelect: await utilities.buildClassificationList(),
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
            classificationSelect: await utilities.buildClassificationList(),
            nav,
            errors: null,
        });
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
  }

/* ***************************
*  Build edit inventory view
* ************************** */
invCont.editInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehicleById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
  }

module.exports = invCont;