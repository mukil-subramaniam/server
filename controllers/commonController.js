const mysql = require('mysql2/promise');
const Common = require('../models/common');
const Card = require('../models/cards');

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports.getdata = async (req, res) => {
    try {
        // Fetch common data and card data
        const [commondata] = await pool.query("SELECT * FROM common LIMIT 1");
        const [carddata] = await pool.query("SELECT * FROM cards LIMIT 1");
        
        res.status(200).json({ commondata: commondata[0], carddata: carddata[0] });
    } catch (e) {
        console.log(e);
        res.status(500).json("Something Went wrong!");
    }
}

module.exports.addcarddata = async (req, res) => {
    try {
        const { topcard, quicklink } = req.body;
        
        // Fetch existing card data
        const [olddata] = await pool.query("SELECT * FROM cards LIMIT 1");
        
        // Update the top card and quick links
        if (topcard != null) {
            olddata[0].top_card.push(topcard);
        }
        if (quicklink != null) {
            olddata[0].quick_links.push(quicklink);
        }

        // Save updated card data back to the database
        await pool.query("UPDATE cards SET top_card = ?, quick_links = ? WHERE id = ?", [JSON.stringify(olddata[0].top_card), JSON.stringify(olddata[0].quick_links), olddata[0].id]);
        
        res.status(200).json({ carddata: olddata[0] });
    } catch (e) {
        console.log(e);
        res.status(500).json("Something Went wrong!");
    }
}

module.exports.updatecarddata = async (req, res) => {
    try {
        const { topcard, quicklink } = req.body;

        // Fetch existing card data
        const [olddata] = await pool.query("SELECT * FROM cards LIMIT 1");

        // Update top card and quick links
        if (topcard != null) {
            olddata[0].top_card = topcard;
        }
        if (quicklink != null) {
            olddata[0].quick_links = quicklink;
        }

        // Save updated card data back to the database
        await pool.query("UPDATE cards SET top_card = ?, quick_links = ? WHERE id = ?", [JSON.stringify(olddata[0].top_card), JSON.stringify(olddata[0].quick_links), olddata[0].id]);
        
        res.status(200).json({ carddata: olddata[0] });
    } catch (e) {
        console.log(e);
        res.status(500).json("Something Went wrong!");
    }
}

module.exports.updatecommondata = async (req, res) => {
    try {
        const { version, versionCode } = req.body;
        
        // Update common data in the database
        const [commondata] = await pool.query("UPDATE common SET appVersion = ?, versionCode = ? WHERE id = 1", [version, versionCode]);
        
        res.status(200).json({ commondata });
    } catch (e) {
        console.log(e);
        res.status(500).json("Something Went wrong!");
    }
}

module.exports.getCollege = async (req, res) => {
    try {
        const [clgdata] = await pool.query("SELECT * FROM college LIMIT 1");
        res.status(200).json(clgdata[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json("Something Went wrong!");
    }
}

module.exports.getDept = async (req, res) => {
    try {
        const [deptdata] = await pool.query("SELECT * FROM department");
        res.status(200).json(deptdata);
    } catch (error) {
        console.log(error);
        res.status(500).json("Something Went wrong!");
    }
}
module.exports.getDeptCount = async (req, res) => {
    try {
        // Ensure you are querying the correct table name
        const [deptdata] = await pool.query("SELECT deptName, duration FROM departments"); // Use 'departments' if that is the correct name
        
        // Check if deptdata is not empty before mapping
        if (deptdata.length === 0) {
            return res.status(404).json("No departments found.");
        }

        // Map over the results to format the response
        const responseData = deptdata.map(e => ({ deptname: e.deptName, duration: e.duration }));
        
        // Send the response
        res.status(200).json(responseData);
    } catch (error) {
        // Log the error to the console
        console.log(error);
        
        // Send a 500 response on error
        res.status(500).json("Something went wrong!");
    }
}
