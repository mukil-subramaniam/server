const express = require('express');
const {
    newnotify,
    getAllnotify,
    updatenotify,
    getfullnotify,
    deletenotify
} = require('../controllers/pushnotificationController'); // Ensure this path is correct

const router = express.Router();

// Route to create a new notification
router.post("/newnotify", async (req, res) => {
    try {
        await newnotify(req, res); // Call the controller function
    } catch (error) {
        console.error("Error in /newnotify:", error);
        res.status(500).json({ message: "Failed to create notification." });
    }
});

// Route to get all notifications
router.get("/getall", async (req, res) => {
    try {
        await getAllnotify(req, res); // Call the controller function
    } catch (error) {
        console.error("Error in /getall:", error);
        res.status(500).json({ message: "Failed to retrieve notifications." });
    }
});

// Route to get full notification details for admin
router.get("/admin/getall", async (req, res) => {
    try {
        await getfullnotify(req, res); // Call the controller function
    } catch (error) {
        console.error("Error in /admin/getall:", error);
        res.status(500).json({ message: "Failed to retrieve full notifications." });
    }
});

// Route to update a notification for admin
router.put("/admin/update", async (req, res) => {
    try {
        await updatenotify(req, res); // Call the controller function
    } catch (error) {
        console.error("Error in /admin/update:", error);
        res.status(500).json({ message: "Failed to update notification." });
    }
});

// Route to delete a notification for admin
router.delete("/admin/delete", async (req, res) => {
    try {
        await deletenotify(req, res); // Call the controller function
    } catch (error) {
        console.error("Error in /admin/delete:", error);
        res.status(500).json({ message: "Failed to delete notification." });
    }
});

module.exports = router;
