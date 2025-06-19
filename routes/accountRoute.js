// Needed resources:
const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const accountValidate = require("../utilities/account-validation");
const utilities = require("../utilities/");

router.get("/login/", utilities.handleErrors(accountController.buildLogin));

router.post(
    "/login/",
    accountValidate.loginRules(),
    accountValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
);

router.get("/register/", utilities.handleErrors(accountController.buildRegister));

router.post(
    "/register/",
    accountValidate.registationRules(),
    accountValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

router.get("/logout", utilities.handleErrors(accountController.accountLogout));

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildViewAccount));
router.get("/edit/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildEditAccount));
router.post(
    "/edit/:account_id",
    utilities.checkLogin,
    accountValidate.editAccountRules(),
    accountValidate.checkEditData,
    utilities.handleErrors(accountController.editAccount)
);
router.post(
    "/edit-password/:account_id",
    utilities.checkLogin,
    accountValidate.editPassowrdRules(),
    accountValidate.checkEditData,
    utilities.handleErrors(accountController.editPassword));


module.exports = router;