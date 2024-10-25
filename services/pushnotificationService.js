const https = require("https");

const SendNotification = async (data, cb) => {
    // Set up the headers for the request
    const headers = {
        "Content-Type": "application/json;charset=utf-8",
        "Authorization": "Basic " + process.env.ONE_SIGNAL_CONFIG_APP_KEY,
    };

    // Define the options for the HTTPS request
    const options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers,
    };

    // Create the request
    const req = https.request(options, (res) => {
        let responseData = '';

        // Collect the data chunks
        res.on("data", (chunk) => {
            responseData += chunk;
        });

        // Handle the end of the response
        res.on("end", () => {
            try {
                const parsedData = JSON.parse(responseData);
                console.log(parsedData);
                return cb(null, parsedData);
            } catch (err) {
                console.error("Failed to parse response:", err);
                return cb({
                    message: "Failed to parse response",
                    error: err,
                });
            }
        });
    });

    // Handle request errors
    req.on("error", (e) => {
        console.error("Request error:", e);
        return cb({
            message: e.message,
        });
    });

    // Write the data to the request body
    req.write(JSON.stringify(data));
    req.end();
}

module.exports = { SendNotification };
