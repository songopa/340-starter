const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list ='<a href="/" title="Home page">Home</a>'
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

module.exports = Util