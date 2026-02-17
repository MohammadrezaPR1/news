import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// کدی هستش که میخواد ما رو به دیتابیس خودمون متصل کنه 
const db = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
        keepAlive: true
    },
    // Required for some connection poolers (like Supavisor Transaction Mode)
    minifyAliases: true,
    pool: {
        max: 3, // Reduced for serverless to prevent hitting limits
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false
});

export default db; 
