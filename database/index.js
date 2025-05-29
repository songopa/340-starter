const { Pool } = require('pg');
require('dotenv').config();
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */

let pool;
if (process.env.NODE_ENV === 'development') {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    })

    // Added for troubleshooting queries
    // during development
    module.exports = {
        async query(text, params) {
            try {
                const res = await pool.query(text, params);
                console.log('Executed query:', { text });
                return res;
            } catch (err) {
                console.error('Error executing query:', { text });
                throw err; // Re-throw the error for further handling
            }
        },
    }
} else {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    module.exports = pool;
}