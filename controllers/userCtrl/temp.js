const express = require("express");
const multer = require("multer");
const { User, asyncHandler } = require("./modules.js");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Define the destination folder for uploads
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;

    // Check if user exists
    const findUser = await User.findOne({ email: email });

    if (!findUser) {
        // Handle file upload
        if (req.file) {
            // Save file path or URL to the user's profilePicture field
            req.body.profilePicture = req.file.path; // Update with the actual field name from your schema
        }

        // Create user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        res.status(400);
        throw new Error("User already exists");
    }
});

const app = express();

// Define the route for user creation with file upload
app.post("/createUser", upload.single("profilePicture"), createUser);

module.exports = app;
