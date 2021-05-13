/*
*	David Hong
*	ECS 3200
*	Carson's Village: Automated Family Page
*	database.js
*		defines database connection
*	WARNING: DO NOT DIRECTLY DECLARE CREDENTIALS IN FINAL PRODUCT, PROTOTYPE/DEMONSTRATION USE ONLY
*		in final product, pass credentials as environment variables for security reasons
*/
const {Client} = require('pg');
/*
*	declare PostgreSQL database credentials to initiate connection
*	the below represents default user, host, password, and port for a PostgresSQL table
*		for security reasons, set these to a different value in the final product
*/
const client = new Client({
	user: 'postgres', 
	host: 'localhost', 
	database: 'EPICS_Project', 
	password: 'postgres', 
	port: 5432
});
//export modules for user in server.js
module.exports = client;