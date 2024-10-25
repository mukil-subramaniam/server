const mongoose = require('mongoose');
const Student = require('../models/student')
const Parent = require('../models/parent')
const Faculty = require('../models/faculty')
const Administration = require('../models/administration')
const User = require('../models/user')
const College = require('../models/college')
const Department = require('../models/department')
const NonTeaching = require('../models/nonTeaching');
const { pushnotify } = require('./pushnotificationController');
const mysql = require('mysql2/promise');
const pushNotify = (devices, content, title, link, url) => pushnotify(devices, content, title, link, url)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports.login = async (req, res) => {
    const data = {
        0: "admission",
        1: "first",
        2: "second",
        3: "third",
        4: "fourth",
        5: "fifth",
        8: "passedOut"
    };
    const logincontent = "Welcome to the KEC Hub! You're successfully logged in. Stay updated on academic progress, and engage with the latest events and information at Kongu Engineering College. Explore the app to make the most of your KEC experience!";
    const logintitle = "Welcome to the KEC Hub";

    try {
        const { type, displayName, rollNo, email, year, photoUrl, userId, dept, deviceId } = req.body;

        const connection = await pool.getConnection();

        switch (type) {
            case "student": {
                const [existingUser] = await connection.execute('SELECT * FROM students WHERE userId = ?', [userId]);
                if (existingUser.length > 0) {
                    return res.status(409).json({
                        error: "User already exists",
                        message: "The user with this username/email already exists in the system. Please Logout from that device to login to other devices"
                    });
                }

                const newUser = {
                    displayName,
                    rollNo,
                    email,
                    dept,
                    year,
                    photoUrl,
                    userId,
                    deviceId
                };

                // Insert new student into MySQL
                await connection.execute('INSERT INTO students SET ?', newUser);

                // Assuming you have a department table to link students to departments
                const [department] = await connection.execute('SELECT * FROM departments WHERE deptName = ?', [dept]);
                if (department.length > 0 && department[0].duration < year) {
                    return res.status(500).json("Something Went Wrong");
                }

                await connection.execute('INSERT INTO college_students (userId, deviceId) VALUES (?, ?)', [userId, deviceId]);
                
                // Send notification
                pushNotify([deviceId], `Hii ${displayName.toUpperCase()},` + "\n" + logincontent, logintitle, "", "");
                res.status(200).json({ user: newUser, message: "Successfully Logged In" });
                break;
            }
            case "parent": {
                const [existingParent] = await connection.execute('SELECT * FROM parents WHERE userId = ?', [userId]);
                if (existingParent.length > 0) {
                    return res.status(409).json({
                        error: "User already exists",
                        message: "The user with this username/email already exists in the system. Please Logout from that device to login to other devices"
                    });
                }

                const newParent = { displayName, email, dept, year, photoUrl, userId, deviceId };
                await connection.execute('INSERT INTO parents SET ?', newParent);
                await connection.execute('INSERT INTO college_parents (userId, deviceId) VALUES (?, ?)', [userId, deviceId]);

                pushNotify([deviceId], `Hii ${displayName.toUpperCase()},` + "\n" + logincontent, logintitle, "", "");
                res.status(200).json({ user: newParent, message: "Successfully Logged In" });
                break;
            }
            case "faculty": {
                const [existingFaculty] = await connection.execute('SELECT * FROM faculty WHERE userId = ?', [userId]);
                if (existingFaculty.length > 0) {
                    return res.status(409).json({
                        error: "User already exists",
                        message: "The user with this username/email already exists in the system. Please Logout from that device to login to other devices"
                    });
                }

                const newFaculty = { displayName, email, dept, photoUrl, userId, deviceId };
                await connection.execute('INSERT INTO faculty SET ?', newFaculty);
                await connection.execute('INSERT INTO college_faculty (userId, deviceId) VALUES (?, ?)', [userId, deviceId]);

                pushNotify([deviceId], `Hii ${displayName.toUpperCase()},` + "\n" + logincontent, logintitle, "", "");
                res.status(200).json({ user: newFaculty, message: "Successfully Logged In" });
                break;
            }
            case "nonteaching": {
                const [existingNonTeaching] = await connection.execute('SELECT * FROM nonteaching WHERE userId = ?', [userId]);
                if (existingNonTeaching.length > 0) {
                    return res.status(409).json({
                        error: "User already exists",
                        message: "The user with this username/email already exists in the system. Please Logout from that device to login to other devices"
                    });
                }

                const newNonTeaching = { displayName, email, dept, photoUrl, userId, deviceId };
                await connection.execute('INSERT INTO nonteaching SET ?', newNonTeaching);
                await connection.execute('INSERT INTO college_nonteaching (userId, deviceId) VALUES (?, ?)', [userId, deviceId]);

                pushNotify([deviceId], `Hii ${displayName.toUpperCase()},` + "\n" + logincontent, logintitle, "", "");
                res.status(200).json({ user: newNonTeaching, message: "Successfully Logged In" });
                break;
            }
            case "administration": {
                const [existingAdmin] = await connection.execute('SELECT * FROM administration WHERE userId = ?', [userId]);
                if (existingAdmin.length > 0) {
                    return res.status(409).json({
                        error: "User already exists",
                        message: "The user with this username/email already exists in the system. Please Logout from that device to login to other devices"
                    });
                }

                const newAdmin = { displayName, email, photoUrl, userId, deviceId };
                await connection.execute('INSERT INTO administration SET ?', newAdmin);
                await connection.execute('INSERT INTO college_administration (userId, deviceId) VALUES (?, ?)', [userId, deviceId]);

                pushNotify([deviceId], `Hii ${displayName.toUpperCase()},` + "\n" + logincontent, logintitle, "", "");
                res.status(200).json({ user: newAdmin, message: "Successfully Logged In" });
                break;
            }
            case "otheruser": {
                const [existingUser] = await connection.execute('SELECT * FROM users WHERE userId = ?', [userId]);
                if (existingUser.length > 0) {
                    return res.status(409).json({
                        error: "User already exists",
                        message: "The user with this username/email already exists in the system. Please Logout from that device to login to other devices"
                    });
                }

                const newUser = { displayName, email, photoUrl, userId, deviceId };
                await connection.execute('INSERT INTO users SET ?', newUser);
                await connection.execute('INSERT INTO college_others (userId, deviceId) VALUES (?, ?)', [userId, deviceId]);

                pushNotify([deviceId], `Hii ${displayName.toUpperCase()},` + "\n" + logincontent, logintitle, "", "");
                res.status(200).json({ user: newUser, message: "Successfully Logged In" });
                break;
            }
            default:
                res.status(400).json({ message: "Invalid user type" });
                break;
        }

        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Something went wrong...' });
    }
};


module.exports.logout = async (req, res) => {
    const data = {
        0: "admission",
        1: "first",
        2: "second",
        3: "third",
        4: "fourth",
        5: "fifth",
        8: "passedOut"
    };
    const logoutContent = "You've been successfully logged out from KEC Hub. Come back anytime for real-time updates and academic events. Thanks for using KEC Hub!";
    const logoutTitle = "Logged Out!";
    
    try {
        const { type, userId, dept } = req.body;
        const connection = await mysql.createConnection({ /* Your DB connection details */ });

        let existingUser;
        let syear;

        switch (type) {
            case "student":
                // Fetch and delete student
                [existingUser] = await connection.execute('SELECT * FROM students WHERE userId = ?', [userId]);
                await connection.execute('DELETE FROM students WHERE userId = ?', [userId]);
                syear = data[existingUser[0].year];
                await connection.execute('UPDATE departments SET students = JSON_REMOVE(students, ?) WHERE deptName = ?', [`$.${syear}`, dept]);
                break;

            case "parent":
                // Fetch and delete parent
                [existingUser] = await connection.execute('SELECT * FROM parents WHERE userId = ?', [userId]);
                await connection.execute('DELETE FROM parents WHERE userId = ?', [userId]);
                syear = data[existingUser[0].year];
                await connection.execute('UPDATE departments SET parents = JSON_REMOVE(parents, ?) WHERE deptName = ?', [`$.${syear}`, dept]);
                break;

            case "faculty":
                // Fetch and delete faculty
                [existingUser] = await connection.execute('SELECT * FROM faculty WHERE userId = ?', [userId]);
                await connection.execute('DELETE FROM faculty WHERE userId = ?', [userId]);
                await connection.execute('UPDATE departments SET faculty = JSON_REMOVE(faculty, ?) WHERE deptName = ?', [`$.${existingUser[0].dept}`, dept]);
                break;

            case "nonteaching":
                // Fetch and delete non-teaching staff
                [existingUser] = await connection.execute('SELECT * FROM non_teaching WHERE userId = ?', [userId]);
                await connection.execute('DELETE FROM non_teaching WHERE userId = ?', [userId]);
                await connection.execute('UPDATE departments SET nonteaching = JSON_REMOVE(nonteaching, ?) WHERE deptName = ?', [`$.${existingUser[0].dept}`, dept]);
                break;

            case "administration":
                // Fetch and delete administration user
                [existingUser] = await connection.execute('SELECT * FROM administration WHERE userId = ?', [userId]);
                await connection.execute('DELETE FROM administration WHERE userId = ?', [userId]);
                break;

            case "otheruser":
                // Fetch and delete other user
                [existingUser] = await connection.execute('SELECT * FROM users WHERE userId = ?', [userId]);
                await connection.execute('DELETE FROM users WHERE userId = ?', [userId]);
                break;
        }

        // Send notification
        if (existingUser && existingUser[0]) {
            const deviceId = existingUser[0].deviceId;
            const displayName = existingUser[0].displayName.toUpperCase();
            pushNotify([deviceId], `Hii ${displayName},` + "\n" + logoutContent, logoutTitle, "", "");
        }

        res.status(200).json({ message: "Successfully Logged Out" });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Something went wrong...' });
    }
};

module.exports.promote = async (req, res) => {
    try {
        // Fetch all departments
        const [departments] = await pool.query('SELECT * FROM departments');

        // Loop through each department
        for (const department of departments) {
            // Move students and parents to the next year
            const years = ['admission', 'first', 'second', 'third', 'fourth', 'fifth', 'passedOut'];

            // Loop through the years in reverse order to perform promotion
            for (let i = years.length - 1; i > 0; i--) {
                const currentYear = years[i];
                const previousYear = years[i - 1];

                // Skip moving if the current year exceeds the department duration
                if (i > department.duration + 1) continue;

                // Move the students and parents from the current year to the next year
                await pool.query(
                    `UPDATE departments SET students = JSON_ARRAY_APPEND(students, '$', ?) WHERE deptId = ? AND JSON_LENGTH(students) > 0`,
                    [JSON.stringify(department.students[previousYear]), department.deptId]
                );

                await pool.query(
                    `UPDATE departments SET parents = JSON_ARRAY_APPEND(parents, '$', ?) WHERE deptId = ? AND JSON_LENGTH(parents) > 0`,
                    [JSON.stringify(department.parents[previousYear]), department.deptId]
                );
            }

            // Clear the "admission" year for both students and parents
            await pool.query(`UPDATE departments SET students = JSON_SET(students, '$', JSON_ARRAY()) WHERE deptId = ?`, [department.deptId]);
            await pool.query(`UPDATE departments SET parents = JSON_SET(parents, '$', JSON_ARRAY()) WHERE deptId = ?`, [department.deptId]);
        }

        // Find students whose year is less than 8 (excluding "passedOut")
        const [studentsToPromote] = await pool.query('SELECT * FROM students WHERE year < 8');
        const [parentsToPromote] = await pool.query('SELECT * FROM parents WHERE year < 8');

        // Update the year for all fetched students
        for (const student of studentsToPromote) {
            const [dept] = await pool.query('SELECT * FROM departments WHERE deptName = ?', [student.dept]);

            if (dept.length > 0) {
                const duration = dept[0].duration;

                // Update student year based on conditions
                if (student.year >= 2 && student.year <= 5 && student.year === duration) {
                    student.year = 8; // Set the year to "passedOut" (8)
                } else {
                    student.year++; // Increment the year for other years
                }

                // Save the modified student document
                await pool.query('UPDATE students SET year = ? WHERE id = ?', [student.year, student.id]);
            }
        }

        // Update the year for all fetched parents
        for (const parent of parentsToPromote) {
            const [dept] = await pool.query('SELECT * FROM departments WHERE deptName = ?', [parent.dept]);

            if (dept.length > 0) {
                const duration = dept[0].duration;

                // Update parent year based on conditions
                if (parent.year >= 2 && parent.year <= 5 && parent.year === duration) {
                    parent.year = 8; // Set the year to "passedOut" (8)
                } else {
                    parent.year++; // Increment the year for other years
                }

                // Save the modified parent document
                await pool.query('UPDATE parents SET year = ? WHERE id = ?', [parent.year, parent.id]);
            }
        }

        console.log('Promotion to the next year successful');
        res.status(200).json("Promoted successfully!");
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json("Something went wrong!");
    }
};

module.exports.getuser = async (req, res) => {
    try {
        const { id, type } = req.body;
        let query = '';
        let user = null;

        switch (type) {
            case "student":
                query = 'SELECT * FROM students WHERE userId = ?'; // Table name: students
                break;
            case "parent":
                query = 'SELECT * FROM parents WHERE userId = ?'; // Table name: parents
                break;
            case "faculty":
                query = 'SELECT * FROM faculty WHERE userId = ?'; // Table name: faculty
                break;
            case "administration":
                query = 'SELECT * FROM administration WHERE userId = ?'; // Table name: administration
                break;
            case "nonteaching":
                query = 'SELECT * FROM non_teaching WHERE userId = ?'; // Table name: non_teaching
                break;
            case "otheruser":
                query = 'SELECT * FROM users WHERE userId = ?'; // Table name: users
                break;
            default:
                return res.status(400).json("Invalid user type");
        }

        const [rows] = await pool.query(query, [id]); // Execute the query with the user ID
        if (rows.length > 0) {
            user = rows[0]; // Get the first user found
            res.status(200).json({ user, type });
        } else {
            res.status(404).json("User Not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Something Went Wrong!");
    }
};


module.exports.adminlogin = async (req, res) => {
    try {
        const { username, password } = { ...req.body }
        if (password != null && password == "2020itkec" && username == "kechubit") {
            res.status(200).json({ username, password, isAdmin: true });
        } else {

            res.status(404).json("User Not Foud");
        }

    } catch (error) {
        console.log(error)
        res.status(500).json("something went wrong");

    }
}
// const findFirstMatching = (string, regex) => {
//     const match = string.match(regex);
//     if (match != null) {
//         return match[0];
//     } else {
//         return null;
//     }
// }
// const name = findFirstMatching(displayName, regexName);
// const rollNo = findFirstMatching(displayName, regexRoll);

