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
const client = require('./../database.js');	//load database connection

let theErrorMessage = ''
/*
*	/login/
*	file:		/views/login.pug
*	function:	GET
*	user interface for login function
*/
router.get('/', function(req, res) {
	res.render('login');
});
/*
*	/login/
*	file:		/views/profile-family.pug
*				/views/profile-admin.pug
*	function:	POST
*	route user to appropriate page based on entered credentials
*	If a user email is correct, proceed to additional login checks
*	Otherwise, print an error to console
*/
router.post('/', async(req, res) => {
	try{
		const text = 'SELECT user_id, password_hash FROM User_Account WHERE email = $1 AND user_role = $2'; // Sends a query to the dtaabase
		const values = [req.body.email, req.body.user_role]; // Email and user_role are both values that the user inputs
		const queryRes = await client.query(text, values) // Text = the query, values = $1, $2
		// if !SQL exists user_id : update global variable to "Email does not exist" and send to error page
		// Maybe have another like else if so else if password != queryRes.Rows[2] then update global variable to "Password does not match"
		// and send to error page
		// const password = req.body.password;

		if(queryRes.rows[0] != null){
			/*
			*	an access level of 1 denotes a family and generates a family profile
			*	an access level of 2 denotes an advocate/admin and generates an admin profile
			*	any access level  produces no result
			*/

			/* Password verfication
			* if password_hash from the SQL query (password stored in database) does not equal req.body.password
			* (password submitted by user), redirects to error page, and changes the error message to Password error.
			*/

			// Make sure to have if/else if, before just had "if" and then if again and was messing it up
			if (queryRes.rows[0].password_hash != req.body.password) {
				res.redirect('/login/error');
				theErrorMessage = "Password error";
			}
			/* User_Id exists and password matches, redirecting to the proper page
			   values[1] correspond to req.body.user_role where 1 = family and 2 = advocate-admin
			*/
			else if(values[1] == 1){;
				res.redirect('/family/' + queryRes.rows[0].user_id);
			}
			else if(values[1] == 2){
				res.redirect('/advocate-admin/' + queryRes.rows[0].user_id);
			}
		}
		// Query Error -> user ID does not exist, redirect and change error message
		else{
			theErrorMessage = "User ID does not exist";
			res.redirect('/login/error');
		}
	} catch(e){
		res.send(queryErr);
	}

});
/*
*	/login/error
*	file:		/views/login.pug
*	function:	GET
*	occurs if a user enters inaccurate information and prompts re-entry of credentials
*/
router.get('/error', function(req, res) {
	res.render('login', {
		// Have a var for what to make the below string equal to?
		error: theErrorMessage
	}); 
});
//export modules for user in server.js
module.exports = router;