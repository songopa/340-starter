const pool = require('../database/');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const accountModel = {};

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
  
module.exports = accountModel;