import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        console.log("Checking connection with DATABASE_URL...");
        await client.connect();
        console.log("✅ Connection Successful using raw PG client!");
        const res = await client.query('SELECT NOW()');
        console.log("Database Time:", res.rows[0]);
        await client.end();
    } catch (err) {
        console.error("❌ Raw Connection Failed!");
        console.error("Error Code:", err.code);
        console.error("Error Message:", err.message);
        if (err.message.includes("password authentication failed")) {
            console.log("👉 Tip: Your password might be wrong or contains special characters that need encoding.");
        }
        if (err.code === 'ENOTFOUND') {
            console.log("👉 Tip: The hostname is wrong or you are not using the Transaction Pooler.");
        }
    }
}

testConnection();
