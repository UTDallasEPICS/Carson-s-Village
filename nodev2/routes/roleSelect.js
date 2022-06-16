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

let theErrorMessage = ''

/*
*	function:	GET
*	retrieve the user's authenticated email and find their role
* 	based on their role, lead them to their role-specific page
*/
router.get("/", async(req, res) =>  {
	console.log(req.oidc.isAuthenticated());
	console.log(JSON.stringify(req.oidc.user.email));

	// universal variable to determine if the user was authenticated or not
	isAuthenticated = req.oidc.isAuthenticated();

	// Parsed email is in the format "evelynkha@yahoo.com" so we replace double quote with single
	userEmail = (JSON.stringify(req.oidc.user.email)).replace(/"/g, "'");
	console.log(userEmail);

/*	! original test was to get the auth0 login page to route to /login2.pug --> passed
	res.render("login2", {
		// setting variables in here will make it available in login2.pug
		isAuthenticated: req.oidc.isAuthenticated(),
		userEmail: JSON.stringify(req.oidc.user.email)
	})
	hypothetically, login2.pug will not be needed anymore.
	error pages need to be changed
*/

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
		// Query Error -> user ID does not exist, redirect and change error message
		else{
			theErrorMessage = "User ID does not exist";
			res.redirect('/login2/error');
		}
	} catch(e){
		res.send('Error in query');
	}
	
});

router.get('/error', function(req, res) {
	res.render('login2', {
		// Have a var for what to make the below string equal to?
		error: theErrorMessage
	}); 
});
//export modules for user in server.js
module.exports = router;
