// Needed resources:
const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities/");

router.get("/login/", utilities.handleErrors(accountController.buildLogin));

router.post(
    "/login/",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
);

router.get("/register/", utilities.handleErrors(accountController.buildRegister));

router.post(
    "/register/",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount));

module.exports = router;