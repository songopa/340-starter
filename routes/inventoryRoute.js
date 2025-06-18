// Needed resources:
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildVehicleDetails));
router.get("/", utilities.handleErrors(invController.buildInvManagement));

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.saveNewClassification)
);

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.saveNewInventory)
);

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));
router.post("/edit/:inv_id",
    invValidate.inventoryRules(),
    invValidate.checkInventoryUpdateData,
    utilities.handleErrors(invController.updateInventory)
);



module.exports = router;