/*
*	David Hong
*	ECS 3200
*	Carson's Village: Automated Family Page
*	family.js
*		Denotes functions specific to family accounts
*		Located under "/family/"
*/
const { query } = require('express');
const express = require('express');						//load express for front-end and routes
const router = express.Router();						//load express router
const client = require('./../database.js');				//load database connection

const buildInsert = require('./../query-builder.js');	//load function to build query INSERT statements
const queryErr = 'An error has occurred'
/*
*	/user_id
*	file:		/views/profile-family.pug
*	function:	GET
*	returns user profile based on id
*/
router.get('/:user_id([0-9]+)', async (req, res) =>{
	try{
		
		userEmail = (JSON.stringify(req.oidc.user.email)).replace(/"/g, "'");
		const advocateText = 'SELECT user_role, user_id FROM User_Account WHERE email = ' + userEmail;
		const loggedInUserID = await client.query(advocateText);

		//build select query
		const text = 'SELECT * FROM User_Account WHERE user_id = $1';
		//set condition values
		const values = [req.params.user_id];
		/*
		*	query database
		*		if successful, use query result to generate profile-family.pug template
		*		if failed, print error to console
		*	NOTE
		*		this page is currently not formatted, requires aesthetic overhaul
		*/
		const queryRes = await client.query(text, values)

		if(loggedInUserID.rows[0].user_id == queryRes.rows[0].user_id || (loggedInUserID.rows[0].user_role == 2 && queryRes.rows[0].user_role == 1)){

			//build name
			var name = queryRes.rows[0].first_name;					//attach first name	
			if(queryRes.rows[0].middle_name != null)				//check for middle name
			{
				name = name + ' ' + queryRes.rows[0].middle_name;	//attach middle name
			}
			name = name + ' ' + queryRes.rows[0].last_name;			//attach last name
			res.render('profile-family', {
				profileName: name, 
				email: queryRes.rows[0].email, 
				phone: queryRes.rows[0].phone, 
				insert_link: '/family/' + req.params.user_id + '/page-insert', 
				list_link: '/family/' + req.params.user_id + '/page-list',
			});
		}
		else{
			res.render('unauthorized');
		}	
	} catch(e){
		res.send(queryErr);
	}
});
/*
*	/user_id/page-list
*	file:		/views/client-pages.pug
*	function:	POST
*	return list of applicable pages associated with the family account
*/
router.get('/:user_id([0-9]+)/page-list', async (req, res) =>{
	try{

		userEmail = (JSON.stringify(req.oidc.user.email)).replace(/"/g, "'");
		const advocateText = 'SELECT user_role, user_id FROM User_Account WHERE email = ' + userEmail;
		const loggedInUserID = await client.query(advocateText);

		// use user_id from url to find user role		
		textForRole = 'SELECT user_role, user_id FROM User_Account WHERE user_id = $1';
		//set condition values
		values = [req.params.user_id];
		const urlRoleFind = await client.query(textForRole, values);

		// Can access account only if user_id matches OR user is an admin
		if(loggedInUserID.rows[0].user_id == urlRoleFind.rows[0].user_id || (loggedInUserID.rows[0].user_role == 2 && urlRoleFind.rows[0].user_role == 1)){
			//build select query
			text = 'SELECT family_id, page_name, donation_goal, deadline, status FROM Page_Details WHERE family_id = $1';
			/*
			*	query database
			*		if successful, use query result to generate family-page.pug template
			*		if failed, print error to console
			*/
			const queryRes = await client.query(text, values)

			//list all available pages
			res.render('client-pages', {
				items: queryRes.rows,
				back: '/family/' + req.params.user_id
			});
		}
		else{
			res.render('unauthorized');
		}
			 
	} catch(e) {
		res.send(queryErr);
	}
		
});

/*
*	/user_id/page-insert
*	file:		/views/page-inser.pug
*	function:	GET
*	user interface to fill out information to apply for a family page
*/
router.get('/:user_id([0-9]+)/page-insert', async(req, res) =>{
	try{

		userEmail = (JSON.stringify(req.oidc.user.email)).replace(/"/g, "'");
		const advocateText = 'SELECT user_role, user_id FROM User_Account WHERE email = ' + userEmail;
		const loggedInUserID = await client.query(advocateText);
		
		// use user_id from url to find user role		
		textForRole = 'SELECT user_role, user_id FROM User_Account WHERE user_id = $1';
		//set condition values
		values = [req.params.user_id];
		const urlRoleFind = await client.query(textForRole, values);

		// Can access account only if user_id matches OR user is an admin

		if(loggedInUserID.rows[0].user_id == urlRoleFind.rows[0].user_id || (loggedInUserID.rows[0].user_role == 2 && urlRoleFind.rows[0].user_role == 1)){
			res.render('page-insert', {
				title: 'Family ' + req.params.user_id + ' client creation', 
				userAction: '/family/' + req.params.user_id + '/page-insert',
				back: '/family/' + req.params.user_id
			});
		}
		else{
			res.render('unauthorized');
		}
			 
	} catch(e) {
		res.send(queryErr);
	}

});
/*
*	/user_id/page-insert
*	file:		/views/confirm.pug
*	function:	POST
*	submit family page details to database
*/
router.post('/:user_id([0-9]+)/page-insert', async (req, res) =>{
	try{
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
		const queryRes = await client.query(query)
		res.render('confirm', {});
		
	} catch(e) {
		res.render('failed', {});
	}
});


/*
*	/user_id/edit/page_name
*	file:		/views/page-edit.pug
*	function:	GET
*	return form to edit existing family page
*/
router.get('/:user_id([0-9]+)/edit/:page_name', async (req, res) => {
	try{
		userEmail = (JSON.stringify(req.oidc.user.email)).replace(/"/g, "'");
		const advocateText = 'SELECT user_role, user_id FROM User_Account WHERE email = ' + userEmail;
		const loggedInUserID = await client.query(advocateText);
		
		// use user_id from url to find user role		
		textForRole = 'SELECT user_role, user_id FROM User_Account WHERE user_id = $1';
		//set condition values
		values = [req.params.user_id];
		const urlRoleFind = await client.query(textForRole, values);

		// Can access account only if user_id matches OR user is an admin

		if(loggedInUserID.rows[0].user_id == urlRoleFind.rows[0].user_id || (loggedInUserID.rows[0].user_role == 2 && urlRoleFind.rows[0].user_role == 1)){
			//build select query
			var text = 'SELECT * FROM page_details WHERE family_id = $1 AND page_name = $2';
			//set condition values
			values = [req.params.user_id, req.params.page_name];
			/*
			*	query database
			*		if successful, use query result to generate family-page.pug template
			*		if failed, print error to console
			*/
			const queryRes = await client.query(text, values)
			//load all details of existing page to edit page, separate field underneath for edits
			res.render('page-edit', {
				title: req.params.page_name, 
				page_name: req.params.page_name,
				day_of_birth: convertDate(queryRes.rows[0].day_of_birth),
				day_of_passing: convertDate(queryRes.rows[0].day_of_passing),
				visitation_date: convertDate(queryRes.rows[0].visitation_date), 
				visitation_time: convertTime(queryRes.rows[0].visitation_time),
				visitation_location: queryRes.rows[0].visitation_location, 
				visitation_description: queryRes.rows[0].visitation_description, 
				funeral_date: convertDate(queryRes.rows[0].funeral_date), 
				funeral_time: convertTime(queryRes.rows[0].funeral_time),
				funeral_location: queryRes.rows[0].funeral_location, 
				funeral_description: queryRes.rows[0].funeral_description, 
				donation_goal: queryRes.rows[0].donation_goal.replace("$",""), 
				deadline: convertDateTime(queryRes.rows[0].deadline), 
				obituary: queryRes.rows[0].obituary,
				editPage: '/family/' + req.params.user_id + '/edit/' + req.params.page_name,
				back: '/family/' + req.params.user_id + '/page-list'
			})
		}
		else{
			res.render('unauthorized');
		}			
	} catch(e) {
		res.send(queryErr);
	}
});

/*
*	/user_id/page-insert
*	file:		/views/confirm.pug
*	function:	POST
*	submit family page details to database
*/
router.post('/:user_id([0-9]+)/edit/:page_name', async (req, res) => {
	try{
		var reqFields = Object.keys(req.body);							//get parameter names from previous GET
		reqFields.pop();												//remove "submit" from parameter list

		var reqValues = Object.values(req.body);						//get parameter values from pervious GET
		reqValues.pop();												//remove "submit" from values list
		
		// Convert dates to YYY-MM-DD format and time to military format
		for (var i = 0; i < reqValues.length - 1; i++){
			if(reqValues[i].toString().includes("/")){
				var date = new Date(reqValues[i]);
				reqValues[i] = date.toISOString().split("T")[0];
			}
			else if(reqValues[i].toString().includes(":")){
				var[time, period] = reqValues[i].split(" ");
				var [hours, minutes] = time.split(":");
				if(period == "PM" && hours != 12){
					hours = Number(hours) + 12;
					reqValues[i] = (hours + ":" + minutes);
				}
				else if (period == "AM") {
					var date = new Date(null, null, null, hours, minutes);
					reqValues[i] = (date.getHours() + ":" + date.getMinutes());
				}
			}

		}		
		

		// Convert deadline to UTC format
		var date = new Date(reqValues[14]);
		var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
							   date.getUTCDate(), date.getUTCHours(),
							   date.getUTCMinutes(), date.getUTCSeconds());

		reqValues[14] = date.toISOString().split(":00.")[0];


		var fields = [];
		for(var i = 0; i < reqValues.length; i++){
			if(reqValues[i] != '') {
				fields.push(reqValues[i]);			//add to end of fields
				
			}	
		}

		var text = 'UPDATE page_details SET page_name = $1, day_of_birth = $2, day_of_passing = $3, visitation_date = $4, visitation_time = $5, visitation_location = $6, visitation_description = $7, funeral_date = $8, funeral_time = $9, funeral_location = $10, funeral_description = $11, obituary = $12, donation_goal = $13, deadline = $14 WHERE page_name = \'' +  req.params.page_name + "\'";
		const queryRes = await client.query(text, fields)
		res.render('confirm', {});
		
	} catch(e) {
		res.render('failed', {});
	}
});

/*
	Change date from this format: Tue Jul 26 2022 00:00:00 GMT-0500 (Central Daylight Time)
	to this format: 07/28/2022
*/
function convertDate(str) {
	mnth = ("0" + (str.getMonth() + 1)).slice(-2),
	day = ("0" + str.getDate()).slice(-2);
	return [mnth, day, str.getFullYear()].join("/");
}

/*
	Change datetime-local from this format: 2022-07-22T18:05:00.000Z
	to this format: 07/28/2022
*/
function convertDateTime(str) {

	// UTC to Fri Jul 22 2022 13:05:00 GMT-0500 (Central Daylight Time)
	const reformmatedDate = new Date(str);

	// change date format to 07/22/2022
	const date = convertDate(reformmatedDate);

	// get 13:05:00 and convert it to 01:05 PM
	time = reformmatedDate.toTimeString().split(" ");
	time = convertTime(time[0]);

	str = date + " " + time;
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

router.get('/:user_id([0-9]+)/family-page/:page_name', async (req, res) => {
	try{
		userEmail = (JSON.stringify(req.oidc.user.email)).replace(/"/g, "'");
		const advocateText = 'SELECT user_role, user_id FROM User_Account WHERE email = ' + userEmail;
		const loggedInUserID = await client.query(advocateText);
		
		// use user_id from url to find user role		
		textForRole = 'SELECT user_role, user_id FROM User_Account WHERE user_id = $1';
		//set condition values
		values = [req.params.user_id];
		const urlRoleFind = await client.query(textForRole, values);

		// Can access account only if user_id matches OR user is an admin
		if(loggedInUserID.rows[0].user_id == urlRoleFind.rows[0].user_id || (loggedInUserID.rows[0].user_role == 2 && urlRoleFind.rows[0].user_role == 1)){

			//build select query
			var text = 'SELECT * FROM page_details WHERE family_id = $1 AND page_name = $2';
			//set condition values
			values = [req.params.user_id, req.params.page_name];
			/*
			*	query database
			*		if successful, use query result to generate family-page.pug template
			*		if failed, print error to console
			*/
			const queryRes = await client.query(text, values)
			//load all details of existing page to edit page, separate field underneath for edits
			res.render('family-page', {
				title: req.params.page_name, 
				page_name: req.params.page_name,
				name: queryRes.rows[0].page_name,
				day_of_birth: convertDate(queryRes.rows[0].day_of_birth),
				day_of_passing: convertDate(queryRes.rows[0].day_of_passing),
				visitation_date: convertDate(queryRes.rows[0].visitation_date), 
				visitation_location: queryRes.rows[0].visitation_location, 
				vistitation_description: queryRes.rows[0].visitation_description, 
				visitation_time: convertTime(queryRes.rows[0].visitation_time),
				funeral_date: convertDate(queryRes.rows[0].funeral_date), 
				funeral_time: convertTime(queryRes.rows[0].funeral_time),
				funeral_location: queryRes.rows[0].funeral_location, 
				funeral_description: queryRes.rows[0].funeral_description, 
				donation_goal: queryRes.rows[0].donation_goal, 
				deadline: queryRes.rows[0].deadline, 
				obituary: queryRes.rows[0].obituary,
				back: '/family/' + req.params.user_id + '/edit/' + req.params.page_name
			})
		}
		else{
			res.render('unauthorized');
		}	
	} catch(e) {
		res.send(queryErr);
	}
});

//export modules for user in server.js
module.exports = router;