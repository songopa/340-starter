const pool = require('../database/');

const inventory = {}

/* ***************************
 *  Get all classification data
 * ************************** */
inventory.getClassifications = async function () {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
inventory.getInventoryByClassificationId = async function (classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

inventory.getVehicleById = async function (inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.inv_id = $1`,
            [inv_id]
        )
        return data.rows[0]
    } catch (error) {
        console.error("getVehicleById error " + error)
    }
}   
  
inventory.saveNewClassification = async function (classification_name) {
    try {
        const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        console.error("saveNewClassification error " + error)
        return error.message
    }
    
}

inventory.saveNewInventory = async function (invData) {
    if (!invData.inv_image || invData.inv_image.trim() === "") {
        invData.inv_image = "/images/vehicles/no-image.png"
    }
    if (!invData.inv_thumbnail || invData.inv_thumbnail.trim() === "") {
        invData.inv_thumbnail = "/images/vehicles/no-image-tn.png"
    }

    try {
        const sql = `INSERT INTO public.inventory 
        (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
        return await pool.query(sql, [
            invData.inv_make,
            invData.inv_model,
            invData.inv_year,
            invData.inv_description,
            invData.inv_image,
            invData.inv_thumbnail,
            invData.inv_price,
            invData.inv_miles,
            invData.inv_color,
            invData.classification_id,
        ])
    } catch (error) {
        console.error("saveNewInventory error " + error)
        return error.message
    }
}

module.exports = inventory;