const pushNotificationService = require("../services/pushnotificationService");
const Notification = require("../models/notification");
const College = require("../models/college");
const Department = require("../models/department");
const mysql = require("mysql2/promise");
const yearNum = {
    0: "admission",
    1: "first",
    2: "second",
    3: "third",
    4: "fourth",
    5: "fifth",
    8: "passedOut"
};

// Create a MySQL connection
const pool = mysql.createPool({
    host: process.env.DB_HOST, // Set this in your .env file
    user: process.env.DB_USER, // Set this in your .env file
    password: process.env.DB_PASSWORD, // Set this in your .env file
    database: process.env.DB_NAME // Set this in your .env file
});

// Send a generic notification to all users
exports.SendNotification = (req, res, next) => {
    const message = {
        app_id: process.env.ONE_SIGNAL_CONFIG_APP_ID,
        contents: { en: "KEC Hub Notification Check" },
        headings: { en: "Kec Hub Test" },
        included_segments: ["All"],
        content_available: true,
        small_icon: "ic_stat_onesignal_default",
        data: {
            pushTitle: "CUSTOM NOTIFICATION"
        }
    };

    pushNotificationService.SendNotification(message, (error, results) => {
        if (error) {
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
};

// Send a notification to specific devices
exports.SendNotificationToDevice = (req, res, next) => {
    const message = {
        app_id: process.env.ONE_SIGNAL_CONFIG_APP_ID,
        contents: { en: "KEC Hub Notification Check" },
        headings: { en: "Kec Hub Test" },
        included_segments: ["included_player_ids"],
        include_player_ids: req.body.devices,
        content_available: true,
        small_icon: "ic_stat_onesignal_default",
        large_icon: "ic_stat_onesignal_default",
        big_picture: "https://kms.kongu.edu/web_newspaper/clippings/12_26_2022_08_35_34.jpg",
        app_url: "https://freelancer.kongu.edu",
        data: {
            pushTitle: "CUSTOM NOTIFICATION"
        }
    };

    pushNotificationService.SendNotification(message, (error, results) => {
        if (error) {
            console.log('Error sending notification');
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
};

// Push notification with customizable parameters
exports.pushnotify = (devices, content, title, link, url) => {
    const message = {
        app_id: process.env.ONE_SIGNAL_CONFIG_APP_ID,
        contents: { en: content },
        headings: { en: title },
        included_segments: ["included_player_ids"],
        include_player_ids: devices,
        content_available: true,
        small_icon: "ic_stat_onesignal_default",
        large_icon: "ic_stat_onesignal_default",
        big_picture: link,
        app_url: url,
        data: {
            pushTitle: title,
        }
    };

    pushNotificationService.SendNotification(message, (error, results) => {
        if (error) {
            return {
                message: "Error",
                error: error,
            };
        }
        return {
            message: "Success",
            data: results,
        };
    });
};

// Create a new notification
exports.newnotify = async (req, res) => {
    try {
        console.log({ ...req.body });
        const { title, message, img_link, url, type, year, dept } = { ...req.body };
        const newnoti = new Notification({ expireAt: Date.now() + 1000 * 60 * 60 * 24, ...req.body });
        let allDeviceIds = [];

        // Handle different types of notifications based on criteria
        if (type[0] === "All" && dept[0] === "All") {
            const [data] = await pool.query("SELECT * FROM college"); // Adjust the query as needed
            // Process the results to fetch device IDs
            data.forEach(item => {
                // Your logic to gather device IDs
            });
        } else if (dept[0] === "All") {
            const [data] = await pool.query("SELECT * FROM college"); // Adjust the query as needed
            // Process the results to fetch device IDs
            data.forEach(item => {
                // Your logic to gather device IDs
            });
        } else {
            // Fetch deviceIds based on the query parameters
            const getDeviceIds = async (dept, type, year) => {
                try {
                    const [departments] = await pool.query("SELECT * FROM department WHERE deptName IN (?)", [dept]);
                    // Your logic to gather device IDs from departments
                    return filteredData;
                } catch (error) {
                    console.error('Error:', error);
                    throw error;
                }
            };

            const deviceIds = await getDeviceIds(dept, type, year);
            allDeviceIds = deviceIds;
        }

        // Add device IDs for administration and others if specified
        if (type.includes("administration")) {
            const [administrationdata] = await pool.query("SELECT * FROM college");
            allDeviceIds = allDeviceIds.concat(administrationdata.map(admin => admin.deviceId));
        }
        if (type.includes("others")) {
            const [othersdata] = await pool.query("SELECT * FROM college");
            allDeviceIds = allDeviceIds.concat(othersdata.map(others => others.deviceId));
        }
        
        console.log(allDeviceIds);
        await newnoti.save();
        
        // Push the notification
        exports.pushnotify(allDeviceIds, message, title, img_link, url);
        res.status(200).json("Sent Successfully!");
    } catch (error) {
        console.log(error);
        res.status(500).json("Something Went Wrong");
    }
};

// Get all notifications based on type, year, and department
exports.getAllnotify = async (req, res) => {
    try {
        const { dept, year, type } = { ...req.body };
        const [data] = await pool.query("SELECT * FROM notifications WHERE type IN (?) AND year IN (?) AND dept IN (?)", [type, year, dept]);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json("Something went wrong");
    }
};

// Get all notifications without filters
exports.getfullnotify = async (req, res) => {
    try {
        const [data] = await pool.query("SELECT * FROM notifications");
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json("Something went wrong");
    }
};

// Delete a notification by ID
exports.deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        await pool.query("DELETE FROM notifications WHERE id = ?", [notificationId]);
        res.status(200).json("Deleted Successfully!");
    } catch (error) {
        console.log(error);
        res.status(500).json("Something Went Wrong");
    }
};