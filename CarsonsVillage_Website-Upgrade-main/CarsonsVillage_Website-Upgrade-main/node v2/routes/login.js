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
*/
router.post('/', function(req, res) {
	//declare select query
	var text = 'SELECT user_id FROM User_Account WHERE email = $1 AND user_role = $2';
	//set condition values
	var values = [req.body.email, req.body.user_role];
	/*
	*	query database
	*		if successful, use query result to profile page or login error
	*		if failed, print error to console
	*/
	client.query(text, values)
		.then(queryRes => {
			/*
			*	If a user email is correct, proceed to additional login checks
			*	Otherwise, print an error to console
			*/
			if(queryRes.rows[0] != null)
			{
				/*
				*	an access level of 1 denotes a family and generates a family profile
				*	an access level of 2 denotes an advocate/admin and generates an admin profile
				*	any access level  produces no result
				*/
				if(values[1] == 1)
				{
					//load family profile based on user id 
					res.redirect('/family/' + queryRes.rows[0].user_id);
				}
				else if(values[1] == 2)
				{
					//load admin profile based on user id
					res.redirect('/advocate-admin/' + queryRes.rows[0].user_id);
				}
			}
			else
			{
				//redirect to /login/error, which represents and inaccurate credential
				res.redirect('/login/error');
			}
		})
		.catch(queryErr => {
			res.send(queryErr);
		});
});
/*
*	/login/error
*	file:		/views/login.pug
*	function:	GET
*	occurs if a user enters inaccurate information and prompts re-entry of credentials
*/
router.get('/error', function(req, res) {
	res.render('login', {
		error: '\nThis message denotes an error in the login process\n'
	}); 
});
//export modules for user in server.js
module.exports = router;