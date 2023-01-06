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
const { PrismaClient } = require("@prisma/client")

module.exports = new PrismaClient({ log: ['info', 'warn', 'error'] });