// Needed resources:
const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

console.log("inventoryRoute.js loaded");

router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;