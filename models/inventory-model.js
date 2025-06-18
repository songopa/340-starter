const pool = require('../database/');

const inventory = {}

/* ***************************
 *  Get all classification data
 * ************************** */
inventory.getClassifications = async function () {
    
    try {
        return classifications = await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
    } catch (error) {
        console.error("getClassifications error " + error)
        return null
    }
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

inventory.saveNewVehicle = async function (invData) {
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

inventory.updateVehicle = async function (invData) {

    try {
        console.log(parseInt(invData.inv_miles),
            parseInt(invData.classification_id),
            parseInt(invData.inv_id),)
        const sql = `UPDATE public.inventory
        SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, 
            inv_price = $5, inv_miles = $6, inv_color = $7, classification_id = $8
        WHERE inv_id = $9 RETURNING *`
        return await pool.query(sql, [
            invData.inv_make,
            invData.inv_model,
            invData.inv_year,
            invData.inv_description,
            invData.inv_price,
            parseInt(invData.inv_miles),
            invData.inv_color,
            parseInt(invData.classification_id),
            parseInt(invData.inv_id),
        ])
    } catch (error) {
        console.error("updateVehicle error " + error)
        return error.message
    }
}

module.exports = inventory;