const pool = require('../database/');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const accountModel = {};


accountModel.checkExistingEmail = async function (account_email) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const result = await pool.query(sql, [account_email])
        if (result.rows.length > 0) {
            return true; // Email exists
        } else {
            return false; // Email does not exist
        }
    } catch (error) {
        console.error("checkExistingEmail error: ", error);
        return false; // In case of error, assume email does not exist
    }
}
/* *****************************
*   Register new account
* *************************** */
accountModel.registerAccount = async function (account_firstname, account_lastname, account_email, account_password) {
    //Encrypt the password
    const hashedPassword = await bcrypt.hash(account_password, 10);
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword])
    } catch (error) {
        return error.message
    }
}

accountModel.getAccountByEmail = async function (account_email) {
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const result = await pool.query(sql, [account_email])
        if (result.rows.length > 0) {
            return result.rows[0]
        } else {
            return null
        }
    } catch (error) {
        return error.message
    }
}

accountModel.getAccountById = async function (account_id) {
    try {
        const sql = "SELECT * FROM account WHERE account_id = $1"
        const result = await pool.query(sql, [account_id])
        if (result.rows.length > 0) {
            return result.rows[0]
        } else {
            return null
        }
    } catch (error) {
        return error.message
    }
}
accountModel.updateAccount = async function (updatedData) {
    try {
        const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
        const result = await pool.query(sql, [updatedData.account_firstname, updatedData.account_lastname, updatedData.account_email, updatedData.account_id])
        if (result.rows.length > 0) {
            return result.rows[0]
        } else {
            return null
        }
    } catch (error) {
        return error.message
    }
}

accountModel.updatePassword = async function (account_id, newPassword) {
    try {
        const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
        const result = await pool.query(sql, [newPassword, account_id])
        if (result.rows.length > 0) {
            return result.rows[0]
        } else {
            return null
        }
    } catch (error) {
        return error.message
    }
}
  
module.exports = accountModel;