// Needed resources:
const express = require("express");
const router = express.Router();
const utilities = require("../utilities/");
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildVehicleDetails));
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildInvManagement));

router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification",
    utilities.checkAccountType,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.saveNewClassification)
);

router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory",
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.saveNewInventory)
);

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView));
router.post("/edit/:inv_id",
    utilities.checkAccountType, 
    invValidate.inventoryRules(),
    invValidate.checkInventoryUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventoryView));
router.post("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory));


module.exports = router;