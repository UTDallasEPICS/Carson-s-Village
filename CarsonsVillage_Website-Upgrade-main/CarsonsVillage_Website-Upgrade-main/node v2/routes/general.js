/*
*	David Hong
*	ECS 3200
*	Carson's Village: Automated Family Page
*	general.js
*		Denotes functions that do not require family or advocate credentials
*		Located under "/general/"
*/
//Declare required dependencies
const express = require('express');				//load express for front-end and routes
const router = express.Router();				//load express router
const client = require('./../database.js');		//load database connection
/*
*	/general/user-search
*	file:		/pages/user-search.html
*	function:	GET
*	user interface for account search function
*/
router.get('/user-search', function(req, res) {
	res.sendFile('user-search.html', {root: 'pages'});
});
/*
*	/general/user-search
*	file:		/views/user-results.pug
*	function:	POST
*	return list of applicable accounts based on entered credentials
*/
router.post('/user-search', function(req, res) {
	//declare SELECT query
	var text = 'SELECT user_id, first_name, middle_name, last_name FROM User_Account WHERE';
	var values = [];							//declare conditional values
	var reqKeys = Object.keys(req.body);		//get parameter names from precious GET
	var reqValues = Object.values(req.body);	//get parameter values from pervious GET
	var count = 1;								//current condition index
	/*
	*	build condition of SELECT query
	*	iterate through each array element of the user-search GET response
	*	if an item is returned as "" (empty string), do not add
	*	otherwise, add that element to values and add the relevant condition to the query text
	*/
	for(var i = 0; i<reqKeys.length; i++) {
		if(reqValues[i] != '') {
			text = ' ' + text + ' ' + reqKeys[i] + ' = $' + count;
			if(i != reqKeys.length - 1) {
				text = text + ' AND';
			}
			count++;
			values.push(reqValues[i]); 
		}
	}
	/*
	*	query database
	*		if successful, use query result to generate user-results.pug template
	*		if failed, print error to console
	*/
	client.query(text, values)
		.then(queryRes => {
			res.render('user-results', {
				items: queryRes.rows
			});
		})
		.catch(queryErr => {
			console.error(queryErr.stack);
		});
});
/*
*	/general/page-search
*	file:		/pages/page-search.html
*	function:	GET
*	user interface for family page search function
*/
router.get('/pages/page-search', function(req, res) {
	res.sendFile('page-search.html', {root: 'pages'});
});
/*
*	/general/user-search
*	file:		/views/user-results.pug
*	function:	POST
*	return list of applicable pages based on entered fields
*/
router.post('/pages/page-search', function(req, res) {
	//declare SELECT query
	var text = 'SELECT family_id, page_name, donation_goal, deadline FROM Page_Details WHERE';
	var values = [];							//declare conditional values
	var reqKeys = Object.keys(req.body);		//get parameter names from previous GET
	var reqValues = Object.values(req.body);	//get parameter values from pervious GET
	var count = 1;								//current condition index
/*
	*	build condition of SELECT query
	*	iterate through each array element of the user-search GET response
	*	if an item is returned as "" (empty string), do not add
	*	otherwise, add that element to values and add the relevant condition to the query text
	*/
	for(var i = 0; i<reqKeys.length; i++) {
		if(reqValues[i] != '') {
			text = ' ' + text + ' ' + reqKeys[i] + ' = $' + count;
			if(i != reqKeys.length - 1) {
				text = text + ' AND';
			}
			count++;
			values.push(reqValues[i]); 
		}
	}
	/*
	*	query database
	*		if successful, use query result to generate page-search.pug template
	*		if failed, print error to console
	*/
	client.query(text, values)
			.then(queryRes => {
				res.render('page-search', {
					items: queryRes.rows
				});
			})
			.catch(queryErr => {
				res.send(queryErr);
			});
});
/*
*	/general/pages/user_id/page_name
*	file:		/views/family-page.pug
*	function:	GET
*	return specific family page based on family ID and page name
*/
router.get('/pages/:user_id([0-9]+)/test', function(req, res) {
	//build select query
	var text = 'SELECT * FROM Page_Details WHERE family_id = $1';
	//set condition values
	var values = [req.params.user_id];
	/*
	*	query database
	*		if successful, use query result to generate family-page.pug template
	*		if failed, print error to console
	*/
	client.query(text, values)
		.then(queryRes => {
			res.render('family-page', {
				title: req.params.page_name, 
				page_name: req.params.page_name,
				name: queryRes.rows[0].name,
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
})
//export modules for user in server.js
module.exports = router;