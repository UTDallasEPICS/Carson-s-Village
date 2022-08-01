/*
*	David Hong
*	ECS 3200
*	Carson's Village: Automated Family Page
*	search.js
*		Denotes functions that do not require family or advocate credentials
*		Located under "/search/"
*/
//Declare required dependencies
const express = require('express');				//load express for front-end and routes
const router = express.Router();				//load express router
const client = require('../database.js');		//load database connection
const queryErr = 'An error has occurred'
/*
*	/search/user-search
*	file:		/pages/user-search.html
*	function:	GET
*	user interface for account search function
*/
router.get('/', function(req, res) {
	res.render('user-search');
});
/*
*	/search/user-search
*	file:		/views/user-results.pug
*	function:	POST
*	return list of applicable accounts based on entered credentials
*/
router.post('/user-search', async (req, res) => {
	try{
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
		const queryRes = await client.query(text, values)
		res.render('user-results', {
			items: queryRes.rows
		});
	} catch(e) {
		console.error(queryErr.stack);
		console.log(e);
	}
});
/*
*	/search/page-search
*	file:		/pages/page-search.html
*	function:	GET
*	user interface for family page search function
*/
router.get('/', function(req, res) {
	res.render('page-search');
});
/*
*	/search/user-search
*	file:		/views/user-results.pug
*	function:	POST
*	return list of applicable pages based on entered fields
*/
router.get('/', function(req, res) {
	res.render('user-results');
});
router.post('/pages/page-search', async (req, res) =>{
	try{
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
		const queryRes = await client.query(text, values)	
		res.render('page-search', {
			items: queryRes.rows
		});
	} catch(e) {
		res.send(queryErr);
		console.log(e);
	}
});
/*
*	/search/pages/user_id/page_name
*	file:		/views/family-page.pug
*	function:	GET
*	return specific family page based on family ID and page name
*	query database
*	if successful, use query result to generate family-page.pug template
*	if failed, print error to console
*/
router.get('/pages/:user_id([0-9]+)/:page_name', async (req, res) =>{
	try{
		if (req.oidc.isAuthenticated() == true)
		{
			// save the id to access when we want to go back to the page list
			var email = (JSON.stringify(req.oidc.user.email)).replace(/"/g, "'");
			const idQuery = await client.query('SELECT user_id FROM User_Account WHERE email = ' + email);
			const roleQuery = await client.query('SELECT user_role FROM User_Account WHERE email = ' + email);

			if (roleQuery == 2)
			{
				const text = 'SELECT * FROM Page_Details WHERE family_id = $1';
				const values = [req.params.user_id];
				const queryRes = await client.query(text, values);
				res.render('family-page', {
					title: req.params.page_name, 
					page_name: req.params.page_name,
					name: queryRes.rows[0].name,
					day_of_birth: convertDate(queryRes.rows[0].day_of_birth),
					day_of_passing: convertDate(queryRes.rows[0].day_of_passing),
					visitation_date: convertDate(queryRes.rows[0].visitation_date),
					visitation_time: convertTime(queryRes.rows[0].visitation_time),
					visitation_location: queryRes.rows[0].visitation_location,
					vistitation_description: queryRes.rows[0].visitation_description,
					funeral_date: convertDate(queryRes.rows[0].funeral_date),
					funeral_time: convertTime(queryRes.rows[0].funeral_time), 
					funeral_location: queryRes.rows[0].funeral_location, 
					funeral_description: queryRes.rows[0].funeral_description, 
					donation_goal: queryRes.rows[0].donation_goal, 
					deadline: queryRes.rows[0].deadline, 
					obituary: queryRes.rows[0].obituary,
					back: '/advocate-admin/' + idQuery.rows[0].user_id + '/page-list'
				})
			}
			else
			{
				const text = 'SELECT * FROM Page_Details WHERE family_id = $1';
				const values = [req.params.user_id];
				const queryRes = await client.query(text, values);
				res.render('family-page', {
					title: req.params.page_name, 
					page_name: req.params.page_name,
					name: queryRes.rows[0].name,
					day_of_birth: convertDate(queryRes.rows[0].day_of_birth),
					day_of_passing: convertDate(queryRes.rows[0].day_of_passing),
					visitation_date: convertDate(queryRes.rows[0].visitation_date),
					visitation_time: convertTime(queryRes.rows[0].visitation_time),
					visitation_location: queryRes.rows[0].visitation_location,
					vistitation_description: queryRes.rows[0].visitation_description,
					funeral_date: convertDate(queryRes.rows[0].funeral_date),
					funeral_time: convertTime(queryRes.rows[0].funeral_time), 
					funeral_location: queryRes.rows[0].funeral_location, 
					funeral_description: queryRes.rows[0].funeral_description, 
					donation_goal: queryRes.rows[0].donation_goal, 
					deadline: queryRes.rows[0].deadline, 
					obituary: queryRes.rows[0].obituary,
					back: '/family/' + idQuery.rows[0].user_id
				})
			}
		}
		else
		{
			const text = 'SELECT * FROM Page_Details WHERE family_id = $1';
			const values = [req.params.user_id];
			const queryRes = await client.query(text, values);
			res.render('family-page-public', {
				title: req.params.page_name, 
				page_name: req.params.page_name,
				name: queryRes.rows[0].name,
				day_of_birth: convertDate(queryRes.rows[0].day_of_birth),
				day_of_passing: convertDate(queryRes.rows[0].day_of_passing),
				visitation_date: convertDate(queryRes.rows[0].visitation_date),
				visitation_time: convertTime(queryRes.rows[0].visitation_time),
				visitation_location: queryRes.rows[0].visitation_location,
				vistitation_description: queryRes.rows[0].visitation_description,
				funeral_date: convertDate(queryRes.rows[0].funeral_date),
				funeral_time: convertTime(queryRes.rows[0].funeral_time),
				funeral_location: queryRes.rows[0].funeral_location, 
				funeral_description: queryRes.rows[0].funeral_description, 
				donation_goal: queryRes.rows[0].donation_goal, 
				deadline: queryRes.rows[0].deadline, 
				obituary: queryRes.rows[0].obituary
			})
		}
	} catch(e) {
		res.send(queryErr);
		console.log(e);
	}
})

function convertDate(str) {
	str = str.toLocaleString();
	str = str.split(",")[0];
	return str;
}

/*
	Change date from military format: 14:50:00
	to standard format: 2:50 PM
*/
function convertTime(time){
	// convert 00:00:00 to an array 
	time = time.split(':'); 
	var hours = Number(time[0]);
	var minutes = Number(time[1]);

	var standardTime;
	if (hours > 0 && hours <= 12) {
		standardTime = "" + hours;
	} else if (hours > 12) {
		standardTime = "" + (hours - 12);
	} else if (hours == 0) {
		standardTime = "12";
	}
	
	// get minutes
	standardTime += (minutes < 10) ? ":0" + minutes : ":" + minutes; 

	// AM or PM
	standardTime += (hours >= 12) ? " PM" : " AM";
	return standardTime;
}

//export modules for user in server.js
module.exports = router;