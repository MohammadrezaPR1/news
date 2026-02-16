import Users from "./models/userModel.js";
import bcrypt from "bcrypt";
import db from "./config/Database.js";

const createAdmin = async () => {
    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash("123456", salt);

        await Users.create({
            name: "Mohammad Reza",
            email: "mohammadreza@gmail.com",
            password: hashPassword,
            isAdmin: true
        });

        console.log("✅ Admin User Created Successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to create admin user:", error.message);
        process.exit(1);
    }
}

createAdmin();
