import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

// Support both Railway MYSQL_URL and individual env variables
let connection: mysql.Pool;

if (process.env.MYSQL_URL) {
  // Railway uses MYSQL_URL connection string
  console.log('Using MYSQL_URL for database connection');
  const mysqlUrl = new URL(process.env.MYSQL_URL);
  connection = mysql.createPool({
    connectionLimit: 10,
    host: mysqlUrl.hostname,
    port: parseInt(mysqlUrl.port) || 3306,
    user: mysqlUrl.username,
    database: mysqlUrl.pathname.slice(1), // Remove leading /
    password: mysqlUrl.password,
    charset: "utf8mb4",
    timezone: "Asia/Seoul",
  });
  console.log(`Connected to MySQL at ${mysqlUrl.hostname}:${mysqlUrl.port}`);
} else {
  // Local development uses individual env variables
  console.log('Using individual env variables for database connection');
  connection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost',
    user: "root",
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    charset: "utf8mb4",
    timezone: "Asia/Seoul",
  });
  console.log(`Connected to MySQL at ${process.env.DB_HOST || 'localhost'}`);
}

export default connection;
