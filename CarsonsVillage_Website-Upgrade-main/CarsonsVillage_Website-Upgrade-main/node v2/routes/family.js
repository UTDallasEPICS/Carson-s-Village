/*
*	David Hong
*	ECS 3200
*	Carson's Village: Automated Family Page
*	family.js
*		Denotes functions specific to family accounts
*		Located under "/family/"
*/
const express = require('express');						//load express for front-end and routes

const router = express.Router();						//load express router
const client = require('./../database.js');				//load database connection

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
	*		if successful, use query result to generate profile-family.pug template
	*		if failed, print error to console
	*	NOTE
	*		this page is currently not formatted, requires aesthetic overhaul
	*/
	client.query(text, values)
		.then(queryRes => {
			//build name
			var name = queryRes.rows[0].first_name;					//attach first name	
			if(queryRes.rows[0].middle_name != null)				//check for middle name
			{
				name = name + ' ' + queryRes.rows[0].middle_name;	//attach middle name
			}
			name = name + ' ' + queryRes.rows[0].last_name;			//attach last name
			res.render('profile-family', {
				title: 'Profile' + queryRes.rows[0].user_id, 
				header: 'Family Profile: ' + name, 
				email: queryRes.rows[0].email, 
				phone: queryRes.rows[0].phone, 
				insert_link: '/family/' + req.params.user_id + '/page-insert', 
				list_link: '/family/' + req.params.user_id + '/page-list'
			});
		})
		.catch(queryErr => {
			res.send(queryErr);
		});
});
/*
*	/user_id/page-list
*	file:		/views/client-pages.pug
*	function:	POST
*	return list of applicable pages associated with the family account
*/
router.get('/:user_id([0-9]+)/page-list', function(req, res) {
	//build select query
	text = 'SELECT page_name, donation_goal, deadline, status FROM Page_Details WHERE family_id = $1';
	//set condition values
	values = [req.params.user_id];
	/*
	*	query database
	*		if successful, use query result to generate family-page.pug template
	*		if failed, print error to console
	*/
	client.query(text, values)
		.then(queryRes => {
			//list all available pages
			res.render('client-pages', {
				items: queryRes.rows
			});
		}) 
		.catch(queryErr => {
			res.send(queryErr);
		});
	
});
/*
*	/user_id/page-insert
*	file:		/views/page-inser.pug
*	function:	GET
*	user interface to fill out information to apply for a family page
*/
router.get('/:user_id([0-9]+)/page-insert', function(req, res) {
	res.render('page-insert', {
		title: 'Family ' + req.params.user_id + ' client creation', 
		userAction: '/family/' + req.params.user_id + '/page-insert'
	});
});
/*
*	/user_id/page-insert
*	file:		/views/confirm.pug
*	function:	POST
*	submit family page details to database
*/
router.post('/:user_id([0-9]+)/page-insert', function(req, res) {
	var reqFields = Object.keys(req.body);							//get parameter names from previous GET
	reqFields.pop();												//remove "submit" from parameter list
	reqFields.unshift('status');									//add "status" to head of parameter list
	reqFields.unshift('family_id');									//add "family_id" to head of parameter list

	var reqValues = Object.values(req.body);						//get parameter values from pervious GET
	reqValues.pop();												//remove "submit" from values list
	reqValues.unshift(1);											//add 1 as status to head of values list
	reqValues.unshift(req.params.user_id);							//add user_id as user_id to head of values list
	
	var query = buildInsert(reqFields, reqValues, 'Page_Details');	//generate insert statement
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
*	/user_id/edit/page_name
*	file:		/views/page-edit.pug
*	function:	GET
*	return form to edit existing family page
*/
router.get('/:user_id([0-9]+)/edit/:page_name', function(req, res) {
	//build select query
	var text = 'SELECT * FROM page_details WHERE family_id = $1 AND page_name = $2';
	//set condition values
	var values = [req.params.user_id, req.params.page_name];
	/*
	*	query database
	*		if successful, use query result to generate family-page.pug template
	*		if failed, print error to console
	*/
	client.query(text, values)
		.then(queryRes => {
			//load all details of existing page to edit page, separate field underneath for edits
			res.render('page-edit', {
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

router.get('/:user_id([0-9]+)/test', function(req, res) {
	console.log("here");
	//build select query
	var text = 'SELECT * FROM page_details WHERE family_id = $1';
	//set condition values
	var values = [req.params.user_id];
	/*
	*	query database
	*		if successful, use query result to generate family-page.pug template
	*		if failed, print error to console
	*/
	client.query(text, values)
		.then(queryRes => {
			//load all details of existing page to edit page, separate field underneath for edits
			res.render('family-page', {
				title: req.params.page_name, 
				page_name: req.params.page_name,
				name: queryRes.rows[0].page_name,
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