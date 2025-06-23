const pool = require("../database/");

const inquiry = {};

/* ***************************
 *  Save a new inquiry
    * ************************** */
inquiry.saveNewInquiry = async function (inquiryData) {
    try {
        const sql = `INSERT INTO public.inquiry (inquiry_name, inquiry_email, inquiry_purpose, inquiry_text, subscribed) 
                     VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const result = await pool.query(sql, [
            inquiryData.inquiry_name,
            inquiryData.inquiry_email,
            inquiryData.inquiry_purpose,
            inquiryData.inquiry_text,
            inquiryData.subscribed ? inquiryData.subscribed : false,
        ]);
        return result.rows[0];
    } catch (error) {
        console.error("saveNewInquiry error: " + error);
        return null;
    }
}


module.exports = inquiry;