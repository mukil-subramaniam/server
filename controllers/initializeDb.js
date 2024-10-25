const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MySQL database connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports.initcollege = async (req, res) => {
    try {
        // Insert into colleges table
        await pool.query('INSERT INTO colleges () VALUES ()');
        res.status(200).json({ message: "Initialized Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong!" });
    }
};

module.exports.initDept = async (req, res) => {
    try {
        const deptName = req.body.dept;
        const duration = req.body.year;

        // Check if department already exists
        const [existingDept] = await pool.query('SELECT * FROM departments WHERE deptName = ?', [deptName]);
        if (existingDept.length > 0) {
            return res.status(400).json({ message: "Department already exists" });
        }

        // Create the new department
        let students = {};
        let parents = {};
        
        if (duration === 2) {
            students = JSON.stringify({ first: undefined, second: undefined, third: undefined, fourth: undefined, fifth: undefined });
            parents = JSON.stringify({ first: undefined, second: undefined, third: undefined, fourth: undefined, fifth: undefined });
        } else if (duration === 3) {
            students = JSON.stringify({ first: undefined, second: undefined, third: undefined, fourth: undefined, fifth: undefined });
            parents = JSON.stringify({ first: undefined, second: undefined, third: undefined, fourth: undefined, fifth: undefined });
        } else if (duration === 4) {
            students = JSON.stringify({ first: undefined, second: undefined, third: undefined, fourth: undefined, fifth: undefined });
            parents = JSON.stringify({ first: undefined, second: undefined, third: undefined, fourth: undefined, fifth: undefined });
        }

        await pool.query('INSERT INTO departments (deptName, duration, students, parents) VALUES (?, ?, ?, ?)', [deptName, duration, students, parents]);
        res.status(200).json({ message: "Initialized Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong!" });
    }
};

module.exports.initcommon = async (req, res) => {
    try {
        const commondata = { appVersion: "v0.0", versionCode: 0 };

        // Insert into common table
        await pool.query('INSERT INTO common (appVersion, versionCode) VALUES (?, ?)', [commondata.appVersion, commondata.versionCode]);

        // Insert into cards table
        await pool.query('INSERT INTO cards () VALUES ()');
        res.status(200).json({ message: "Initialized Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong!" });
    }
};
