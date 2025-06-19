const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = '<a href="/" title="Home page">Home</a>'
    
    if (data) {
        data.rows.forEach((row) => {
            list +=
                '<a href="/inv/type/' +
                row.classification_id +
                '" title="See our inventory of ' +
                row.classification_name +
                ' vehicles">' +
                row.classification_name +
                "</a>"
        })
    }
    return list

}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display" class="inventory-grid"> '
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="name-price">'
            // grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}
  
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* **************************************
* Build the vehicle details view HTML
* ************************************ */
Util.buildVehicleDetails = async function (data) {
    let details = '<div class="vehicle-container">'
    details += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + '"/>'
    details += '<div class="vehicle-info">'
    details += '<h1> ' + data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model +'</h1>'
    details += '<p><strong>Price: </strong> $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
    details += '<p><strong>Class: </strong> ' + data.classification_name + '</p>'
    details += '<p><strong>Color: </strong> ' + data.inv_color + '</p>'
    details += '<p><strong>Mileage: </strong> ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + ' miles</p>'
    details += '<p><strong>Year: </strong> ' + data.inv_year + '</p>'
    details += '<p><strong>Description: </strong> ' + data.inv_description + '</p>'
    details += '<div class="d-flex-between">'
    details += '<button>Buy Now</button>'
    details += '<button>Contact Us</button>'
    details += '</div>'
    details += '</div>'
    details += '</div>'
    return details
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            })
    } else {
        next()
    }
}
   
/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
   }

/* ****************************************
 *  Build the classification list HTML
 *  for use in forms
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
        '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"'
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected "
        }
        classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}

/* ****************************************
 *  Middleware to make logged-in user data available in all views
 * ************************************ */
Util.accountMiddleware = function (req, res, next) {
    if (req.session && req.session.account_firstname) {
        res.locals.account_firstname = req.session.account_firstname;
    } else {
        res.locals.account_firstname = null;
    }
    next();
}

/* ****************************************
* Middleware to check if user is an Employee or Admin 
**************************************** */
Util.checkAccountType =async function (req, res, next) {
    const token = req.cookies.jwt;
    const nav =await Util.getNav()
    if (!token) {
        req.flash("notice", "You must be logged in as an Employee or Admin to access this page.");
        return res.status(403).render("account/login", {
            title: "Login",
            nav ,
            errors: null,
        });
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
        if (err || !accountData || (accountData.account_type !== "Employee" && accountData.account_type !== "Admin")) {
            req.flash("notice", "You must be an Employee or Admin to access this page.");
            return res.status(403).render("account/login", {
                title: "Login",
                nav,
                errors: null,
            });
        }
        // User is authorized
        res.locals.accountData = accountData;
        next();
    });
};



module.exports = Util