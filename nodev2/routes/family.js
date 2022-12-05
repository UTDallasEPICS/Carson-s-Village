/*
*	David Hong
*	ECS 3200
*	Carson's Village: Automated Family Page
*	family.js
*		Denotes functions specific to family accounts
*		Located under "/family/"
*/
const fs = require('fs');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3')
const s3 = new S3Client({region: 'us-east-2'});
const shortid = require('shortid');
const { query } = require('express');
const express = require('express');						//load express for front-end and routes
const router = express.Router();						//load express router
const client = require('./../database.js');				//load database connection
const upload = multer({									//Sets up the parameters to upload an image(s) to S3 via Multer-S3
	storage: multerS3({
	s3: s3,
	bucket: process.env.AWS_S3_BUCKET_NAME,
	metadata: function (req, file, cb) {
	cb(null, {fieldName: file.fieldname});
	},
})
,
  key: function (req, file, cb) {
	cb(null, shortid.generate() + "-" + file.originalname);			//Sets random key for user uploaded image files.
},
	fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
}
})

const checkFileType = (file, cb) => {				//Makes sure that the user uploads an image.
	const filetypes = /jpeg|jpg|png|gif/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);
  
	if (mimetype && extname) {
	  return cb(null, true);
	} else {
	  cb("Please upload images only (a file type of jpeg, jpg, png, or gif.)");
	}
}

const buildInsert = require('./../query-builder.js');	//load function to build query INSERT statements
const path = require('path');
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
			text = 'SELECT family_id, page_name, donation_goal, deadline, status, timezone FROM Page_Details WHERE family_id = $1';
			/*
			*	query database
			*		if successful, use query result to generate family-page.pug template
			*		if failed, print error to console
			*/
			const queryRes = await client.query(text, values)
			

			for(var i = 0; i < queryRes.rowCount; i++){
				var reformmatedDate = queryRes.rows[i].deadline;
				var setupTime = new Date(reformmatedDate);
				var time = setupTime.getUTCHours() + ":" + setupTime.getUTCMinutes() + ":00";
				time = convertTime(time);
				date = reformmatedDate.toString().split(" ");
				date = date[0] + " " + date[1] + " " + date[2];
				queryRes.rows[i].deadline = date + " " + time
				
			}

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
router.post('/:user_id([0-9]+)/page-insert', upload.array('images'), async (req, res) =>{
	try{
		var reqFields = Object.keys(req.body);							//get parameter names from previous GET
		reqFields.pop();												//remove "submit" from parameter list
		reqFields.unshift('status');									//add "status" to head of parameter list
		reqFields.unshift('family_id');									//add "family_id" to head of parameter list
		var reqValues = Object.values(req.body);						//get parameter values from pervious GET
		reqValues.pop();												//remove "submit" from values list
		reqValues.unshift(1);											//add 1 as status to head of values list
		reqValues.unshift(req.params.user_id);							//add user_id as user_id to head of values list
		var images = reqValues[3];
		var imageLinks = [];
		imageLinks = req.files?.map(f => f.location) || []				//adds the S3 image links to a list
		
		if(imageLinks.length != 0){										//Adds image links to database insertion list if there are images uploaded.
			reqFields.splice(3,0,"images");
			reqValues.splice(3,0, imageLinks);
		}
		
		var query = buildInsert(reqFields, reqValues, 'Page_Details');	//generate insert statement
		/*
		*	query database
		*		if successful, results are inserted
		*			use query result to generate confirm.pug template
		*		if failed, print error to console
		*/
		const queryRes = await client.query(query)
		res.render('confirm', {
			back: '/family/' + req.params.user_id
		});
		
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
				media: queryRes.rows[0].images,
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
				timezone: queryRes.rows[0].timezone, 
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
router.post('/:user_id([0-9]+)/edit/:page_name', upload.array('images') , async (req, res, next) => {
	try{
		var reqFields = Object.keys(req.body);							//get parameter names from previous GET
		reqFields.pop();												//remove "submit" from parameter list

		var reqValues = Object.values(req.body);						//get parameter values from pervious GET
		reqValues.pop();												//remove "submit" from values list
		var imageLinks = [];											// Takes the S3 buckets link of the images to a list.	
		imageLinks = req.files?.map(f => f.location) || []
		
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
		
		//places the image links into reqValues after the last for loop not to break the links due to the backslashes.
		//Adds images to the database insertion list if there is an image.
		if(imageLinks.length != 0) {				   
			reqValues.splice(1, 0, imageLinks);
			// Convert deadline to UTC format
			var date = new Date(reqValues[14]);
			var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
							   date.getUTCDate(), date.getUTCHours(),
							   date.getUTCMinutes(), date.getUTCSeconds());

			reqValues[14] = date.toISOString().split(":00.")[0];
		}else{
			// Convert deadline to UTC format
			var date = new Date(reqValues[13]);
			var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
							   date.getUTCDate(), date.getUTCHours(),
							   date.getUTCMinutes(), date.getUTCSeconds());

			reqValues[13] = date.toISOString().split(":00.")[0];
		}

		var fields = [];
		for(var i = 0; i < reqValues.length; i++){
			if(reqValues[i] != '' && reqValues[i] != []) {
				fields.push(reqValues[i]);			//add to end of fields
			}	
		}

		var queryRes;
		var text = 'UPDATE page_details SET page_name = $1, images = array_cat(images, $2), day_of_birth = $3, day_of_passing = $4, visitation_date = $5, visitation_time = $6, visitation_location = $7, visitation_description = $8, funeral_date = $9, funeral_time = $10, funeral_location = $11, funeral_description = $12, obituary = $13, donation_goal = $14, deadline = $15 WHERE page_name = \'' +  req.params.page_name + "\'";
		var text2 = 'UPDATE page_details SET page_name = $1, day_of_birth = $2, day_of_passing = $3, visitation_date = $4, visitation_time = $5, visitation_location = $6, visitation_description = $7, funeral_date = $8, funeral_time = $9, funeral_location = $10, funeral_description = $11, obituary = $12, donation_goal = $13, deadline = $14 WHERE page_name = \'' +  req.params.page_name + "\'";
		if(imageLinks.length!=0){
			queryRes = await client.query(text, fields);
		} else{
			queryRes = await client.query(text2, fields);
		}

		res.render('confirm', {
			back: '/family/' + req.params.user_id

		});
		
	} catch(e) {
		res.render('failed', {});
	}
});

/*
*	/user_id/remove-image
*	file:		/views/family-page.pug
*	function:	POST
*	Deletes family page image from the database.
*/
router.post('/:user_id([0-9]+)/remove-image/:page_name' , async (req, res) => {
	try{
		var reqValues = Object.values(req.body);
		var reqDictionary = reqValues[0].split(":");
		var imageLink = reqDictionary[3];
		imageLink = imageLink.substring(2, imageLink.length-2);
		page_name = (reqDictionary[1].split(",")[0]);
		page_name = page_name.substring(1, page_name.length-1);

		var fields = [];
		fields.push('https://' + imageLink);
		
		var text ='UPDATE page_details SET images = ARRAY_REMOVE(images, $1) WHERE page_name = \'' + page_name+ "\'";
		var queryRes = await client.query(text, fields);
		text = 'SELECT * FROM page_details WHERE family_id = $1 AND page_name = $2';
		values = [req.params.user_id, page_name];
			/*
			*	query database
			*		if successful, use query result to generate family-page.pug template
			*		if failed, print error to console
			*/
			 queryRes = await client.query(text, values)
			//load all details of existing page to edit page, separate field underneath for edits
			res.render('family-page', {
				title: page_name, 
				page_name: page_name,
				name: page_name,
				media: queryRes.rows[0].images,
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
				timezone: queryRes.rows[0].timezone, 
				obituary: queryRes.rows[0].obituary,
				back: '/family/' + req.params.user_id
			})

	} catch(e) {
		res.render('failed', {});
	}
});

/*
	Change date from this format: Tue Jul 26 2022 00:00:00 GMT-0500 (Central Daylight Time)
	to this format: 07/28/2022
*/
function convertDate(str) {
	str = str.toLocaleString();
	str = str.split(",")[0];
	return str;
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
	time = reformmatedDate.toUTCString().split(" ");
	time = convertTime(time[4]);

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
				media: queryRes.rows[0].images,
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
				timezone: queryRes.rows[0].timezone, 
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