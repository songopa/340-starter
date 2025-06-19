const utilities = require("../utilities/")
const accountModel = require("../models/account-model.js")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcryptjs")

const accountFunctions = {}

accountFunctions.buildRegister = async function (req, res) {
    const nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountFunctions.registerAccount = async function (req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered as ${account_firstname} ${account_lastname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        res.locals = req.body
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}

/* ****************************************
*  Deliver login view
* *************************************** */
accountFunctions.buildLogin = async function (req, res) {
    const nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null
    })
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountFunctions.accountLogin = async function (req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    res.locals.account_email = account_email
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            req.session.account_firstname = accountData.account_firstname
            req.session.accountData = accountData
            return res.redirect("/account/")
        }
        else {

            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden - ' + error)
    }
  }

  accountFunctions.accountLogout = async function (req, res) {
      
      // Clear the JWT cookie
      res.clearCookie("jwt")
      req.flash("notice", "You have been logged out.")
      res.redirect("/account/login/")
  }
  
accountFunctions.buildViewAccount = async function (req, res) {
    let nav = await utilities.getNav()
    res.render("account/account", {
        title: "Account",
        nav,
        accountData: req.session.accountData,
        errors: null
    })
}

accountFunctions.buildEditAccount = async function (req, res) {
    let nav = await utilities.getNav()
    const accountId = req.params.account_id
    const accountData = await accountModel.getAccountById(accountId)
    if (!accountData) {
        req.flash("notice", "Sorry, that account does not exist.")
        return res.status(404).render("errors/error", {
            title: "Account Not Found",
            message: "The requested account could not be found.",
            nav
        })
    }
    if (accountData.account_id !== req.session.accountData.account_id) {
        req.flash("notice", "You do not have permission to edit this account.")
        return res.status(403).render("errors/error", {
            title: "Access Forbidden",
            message: "You do not have permission to edit this account.",
            nav
        })
    }

    delete accountData.account_password // Remove password from account data
    req.flash()
    res.render("account/edit-account", {
        title: "Edit Account",
        nav,
        accountData,
        errors: null
    })
}

accountFunctions.editAccount = async function (req, res) {
    let nav = await utilities.getNav()
    const result = await accountModel.updateAccount(req.body)
    if (result) {
        req.flash("notice", "Account updated successfully.")
        delete result.account_password // Remove password from session data
        req.session.accountData = result
        return res.status(200).redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the update failed. Please try again.")
        return res.status(501).render("account/edit-account", {
            title: "Edit Account",
            nav,
            accountData: req.body,
            errors: null
        })
    }
}

accountFunctions.editPassword = async function (req, res) {
    let nav = await utilities.getNav()
    const accountId = req.params.account_id
    const hashedPassword = await bcrypt.hash(req.body.new_password, 10)
    const result = await accountModel.updatePassword(accountId, hashedPassword)
    if (result) {
        req.flash("notice", "Password updated successfully.")
        delete result.account_password // Remove password from session data
        req.session.accountData = result
        return res.status(200).redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the update failed. Please try again.")
        return res.status(501).render("account/edit-account", {
            title: "Edit Account",
            nav,
            accountData: req.body,
            errors: null
        })
    }
}



module.exports = accountFunctions;