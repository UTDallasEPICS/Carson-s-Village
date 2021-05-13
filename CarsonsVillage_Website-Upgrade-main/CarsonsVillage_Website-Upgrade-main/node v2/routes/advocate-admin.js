/*
*	David Hong
*	ECS 3200
*	Carson's Village: Automated Family Page
*	advocate-admin.js
*		Denotes functions specific to advocate accounts
*		Located under "/advocate-admin/"
*/
const express = require('express');						//load express for front-end and routes
const router = express.Router();						//load express router
const client = require('./../database.js'); 			//load database connection
const buildInsert = require('./../query-builder.js');	//load function to build query INSERT statements
/*
*	/user_id
*	file:		/views/profile-family.pug
*	function:	GET
*	returns user profile based on id
*/
router.get('/:user_id([0-9]+)', function(req, res) {
	//build select query
	var text = 'SELECT * FROM User_Account WHERE user_id = $1'; 
	//set condition values
	var values = [req.params.user_id];
	/*
	*	query database
	*		if successful, use query result to generate profile-admin.pug template
	*		if failed, print error to console
	*	NOTE
	*		this page is currently not formatted, requires aesthetic overhaul
	*/
	client.query(text, values)
		.then(queryRes => {
			var name = queryRes.rows[0].first_name;					//attach first name	
			if(queryRes.rows[0].middle_name != null)				//check for middle name
			{
				name = name + ' ' + queryRes.rows[0].middle_name;	//attach middle name
			}
			name = name + ' ' + queryRes.rows[0].last_name;			//attach last name
			res.render('profile-admin', {
				title: 'Profile ' + queryRes.rows[0].user_id, 
				header: "Advocate/Admin Profile: " + name, 
				email: queryRes.rows[0].email, 
				phone: queryRes.rows[0].phone
			});
		})
		.catch(queryErr => {
			res.send(queryErr);
		});
});
/*
*	/user_id/user-insert
*	file:		/views/confirm.pug
*	function:	POST
*	submit user account details to database
*/
router.post('/user-insert', function(req, res) {
	var reqFields = Object.keys(req.body);							//get parameter names from previous GET
	reqFields.pop();												//remove "submit" from parameter list
	var reqValues = Object.values(req.body);						//get parameter values from pervious GET
	reqValues.pop();												//remove "submit" from values list
	var query = buildInsert(reqFields, reqValues, 'User_Account');	//generate insert statement
	/*
	*	query database
	*		if successful, results are inserted
	*			use query result to generate confirm.pug template
	*		if failed, print error to console
	*/
	client.query(query)
		.then(queryRes => {
			res.render('confirm', {
				message: 'Data submitted successfully', 
				status: queryRes
			});
		})
		.catch(queryErr => {
			res.render('confirm', {
				message: 'Error, submission failed', 
				status: queryErr
			});
		});
}); 
/*
*	/user_id/page-insert
*	file:		/views/page-inser.pug
*	function:	GET
*	user interface to fill out information to create a new user account
*/
router.get('/user-insert', function(req,  res) {
	res.sendFile('user-insert.html', {root: 'pages'});
});
/*
*	/user_id/page-list
*	file:		/views/advocate-pages.pug
*	function:	GET
*	return list of all family pages associated with every family account
*/
router.get('/page-list', function(req, res) {
	//build select query
	client.query('SELECT family_id, page_name, donation_goal, deadline, status FROM Page_Details')
	/*
	*	query database
	*		if successful, use query result to generate advocate-pages.pug template
	*		if failed, print error to console
	*/
	.then(queryRes => {
		res.render('advocate-pages', {
			headers: ['family_id', 'page_name', 'donation_goal', 'deadline', 'status'], 
			body: queryRes.rows
		});
	})
	.catch(queryErr => {
		res.send(queryErr);
	})
})
/*
*	/user_id/edit/page_name
*	file:		/views/page-review.pug
*	function:	GET
*	attach review to pending family page
*/
router.get('/review/:user_id([0-9]+)/:page_name', function(req, res) {
	//build select query
	var text = 'SELECT * FROM page_details WHERE family_id = $1 AND page_name = $2';
	//set condition values
	var values = [req.params.user_id, req.params.page_name];
	/*
	*	query database
	*		if successful, use query result to generate page-review.pug template
	*		if failed, print error to console
	*/
	client.query(text, values)
		.then(queryRes => {
			res.render('page-review', {
				title: req.params.page_name, 
				page_name: req.params.page_name,
				visitation_date: queryRes.rows[0].visitation_date, 
				visitation_location: queryRes.rows[0].visitation_location, 
				vistitation_description: queryRes.rows[0].visitation_description, 
				funeral_date: queryRes.rows[0].funeral_date, 
				funeral_location: queryRes.rows[0].funeral_location, 
				funeral_description: queryRes.rows[0].funeral_description, 
				donation_goal: queryRes.rows[0].donation_goal, 
				deadline: queryRes.rows[0].deadline, 
				obituary: queryRes.rows[0].obituary
			})
		})
		.catch(queryErr => {
			res.send(queryErr);
		});
});
//export modules for user in server.js
module.exports = router;