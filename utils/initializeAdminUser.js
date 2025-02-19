// initializeAdminUser.js
const User = require('../models/userModel');

const initializeAdminUser = async () => {
    const DEFAULT_USERNAME = "Dhanapal";
    const DEFAULT_PASSWORD = "Dhanapal@123";

    try {
        const existingAdmin = await User.findOne({ username: DEFAULT_USERNAME });
        if (!existingAdmin) {
            const admin = new User({
                username: DEFAULT_USERNAME,
                password: DEFAULT_PASSWORD,
                role: 'admin',
            });
            await admin.save();
            console.log("Default admin user created.");
        }
    } catch (error) {
        console.error("Error initializing admin user:", error.message);
    }
};

module.exports = initializeAdminUser;
