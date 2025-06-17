const utilities = require('../utilities');
const baseController = {};

baseController.buildHome = async function (req, res) {
    const nav = await utilities.getNav();
    // req.flash("notice", "This is  a flash message.")
    res.render('index', { title: "Home", nav });
};

baseController.errorTest = async function (req, res) {
    const nav = await utilities.getNav();
    // Simulate an error
    throw new Error("This is a test error for error handling.");
    
}

module.exports = baseController;