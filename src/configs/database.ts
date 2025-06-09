import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

if (!DB_NAME || !DB_USERNAME || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
  throw new Error("❌ Missing database environment variables.");
}

const db = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  dialect: "mysql",
  logging: false,
  pool: {
    max: 100,
    min: 10,
    acquire: 5000,
    idle: 60000,
  },
});

export default db;
