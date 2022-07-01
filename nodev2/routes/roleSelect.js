/*
*	David Hong
*	ECS 3200
*	Carson's Village: Automated Family Page
*	login.js
*		Denotes functions specific to the login page
*		Located under "/login/"
*/
//Declare required dependencies
const express = require('express');			//load express for front-end and routes
const router = express.Router();			//load express router
const client = require('../database.js');	//load database connection
const buildInsert = require('./../query-builder.js');	//load function to build query INSERT statements
const checkRole = require('../checkRole.js');

let theErrorMessage = ''

/*
*	function:	GET
*	retrieve the user's authenticated email and find their role
* 	based on their role, lead them to their role-specific page
*/
router.get("/", async(req, res) =>  {
	// Parsed email is in the format "evelynkha@yahoo.com" so we replace double quote with single
	userEmail = (JSON.stringify(req.oidc.user.email)).replace(/"/g, "'");
	console.log(userEmail);

	// perform a query using the email
	try{
		const text = 'SELECT user_role, user_id FROM User_Account WHERE email = ' + userEmail;
		const queryRes = await client.query(text)

		console.log(queryRes.rows[0]);
		
		if(queryRes.rows[0] != null){
			/*
			*	an access level of 1 denotes a family and generates a family profile
			*	an access level of 2 denotes an advocate/admin and generates an admin profile
			*/

			if (queryRes.rows[0].user_role == 1){
				res.redirect('/family/' + queryRes.rows[0].user_id);
			}
			else if(queryRes.rows[0].user_role == 2){
				res.redirect('/advocate-admin/' + queryRes.rows[0].user_id);
			}
		}
		// Query Error -> user email does not exist in database, but does exist in auth0
		else{
			console.log('trying to insert new user into database...');

			// generate user-info.pug
			res.render('user-info', {
				// upon submit, redirect to this url
				userAction: '/roleSelect/user-info'
			});

		}
	} catch(e){
		res.send('Error in query');
	}
	
});

/*
*	/roleSelect/user-info
*	function:	POST
*	submit user account details to database using query-builder.js
*/
router.post('/user-info', checkRole(), async (req, res) =>{
	try{

		// INSERT INTO User_Account (email, user_role, first_name, middle_name, last_name, phone) VALUES ($1, $2, $3, $4, $5, $6, $7)
		// user_id is auto-incremented

		// Build INSERT parameters
		var reqFields = ["email", "user_role"];								// initial parameters
		reqFields = reqFields.concat(Object.keys(req.body));				// parameters the users will need to type into
		console.log(reqFields);
		reqFields.pop();													// remove "submit" from parameter list

		// Build VALUE parameters
		email = (JSON.stringify(req.oidc.user.email)).replace(/"/g, "");	// authorized email
		// choosing role based on email
		if(email.toLowerCase().includes("@carsonsvillage.org")){			
			role = 2;
		}
		else{
			role = 1;
		}
		var reqValues = [email, role];										// initial parameters 
		reqValues = reqValues.concat(Object.values(req.body));			    // get first_name, middle_name, last_name, and phone from user
		console.log(reqValues);
		reqValues.pop();													// remove "submit" from values list

		// generate insert statement
		var query = buildInsert(reqFields, reqValues, 'User_Account');		
		console.log(query);

		/*
		*	query database
		*		if successful, results are inserted and new user is directed to their new page
		*		if failed, print error 
		*/
		const insertRes = await client.query(query)

		const userIdText = 'SELECT user_id FROM User_Account WHERE email = ' + userEmail;
		const userIdFromDatabase = await client.query(userIdText);

		// display all the users in the database 
		const allUsersText = 'SELECT * FROM User_Account';
		const allUsers = await client.query(allUsersText);
		console.log(allUsers.rows);

		// redirect the user to their designated home page
		console.log('New account created successfully!')
		if (role == 1){
			res.redirect('/family/' + userIdFromDatabase.rows[0].user_id);
		}
		else if(role == 2){
			res.redirect('/advocate-admin/' + userIdFromDatabase.rows[0].user_id);
		}
	
	} catch(e) {

		console.log("An error occurred! ");
		res.render('confirm', {
			message: 'Error, submission failed. Please fill in the required fields', 
		});
	}
		
});



//export modules for user in server.js
module.exports = router;
