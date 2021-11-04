/*
*	David Hong
*	ECS 3200
*	Carson's Village: Automated Family Page
*	database.js
*		defines database connection
*	WARNING: DO NOT DIRECTLY DECLARE CREDENTIALS IN FINAL PRODUCT, PROTOTYPE/DEMONSTRATION USE ONLY
*		in final product, pass credentials as environment variables for security reasons
*/
const dotenv = require('dotenv');
dotenv.config();
const {Client} = require('pg');
/*
*	declare PostgreSQL database credentials to initiate connection
*	the below represents default user, host, password, and port for a PostgresSQL table
*		for security reasons, set these to a different value in the final product
*/
console.log(`${process.env.DB_PASSWORD}`);
const client = new Client({
	user: process.env.DB_USER, 
    host: process.env.DB_HOST, 
    database: process.env.DATABASE, 
    password: process.env.DB_PASSWORD, 
    port: process.env.DB_PORT
});
//export modules for user in server.js
module.exports = client;