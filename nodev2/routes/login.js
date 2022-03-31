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
*	If a user email is correct, proceed to additional login checks
*	Otherwise, print an error to console
*/
router.post('/', async(req, res) => {
	try{
		const text = 'SELECT user_id FROM User_Account WHERE email = $1 AND user_role = $2';
		const values = [req.body.email, req.body.user_role];
		const queryRes = await client.query(text, values)
		if(queryRes.rows[0] != null){
			/*
			*	an access level of 1 denotes a family and generates a family profile
			*	an access level of 2 denotes an advocate/admin and generates an admin profile
			*	any access level  produces no result
			*/
			if(values[1] == 1){
				res.redirect('/family/' + queryRes.rows[0].user_id);
			}
			else if(values[1] == 2){
				res.redirect('/advocate-admin/' + queryRes.rows[0].user_id);
			}
		}
		else{
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
		error: '\nThis message denotes an error in the login process\n'
	}); 
});
//export modules for user in server.js
module.exports = router;