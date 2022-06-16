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
router.get('/:user_id([0-9]+)', async (req, res) =>{

	userEmail = (JSON.stringify(req.oidc.user.email)).replace(/"/g, "'");
	const advocateText = 'SELECT user_id FROM User_Account WHERE email = ' + userEmail;
	const loggedInUserID = await client.query(advocateText);
            
	try{
		//build select query
		text = 'SELECT * FROM User_Account WHERE user_id = $1'; 
		//set condition values
		const values = [req.params.user_id];
		/*
		*	query database
		*		if successful, use query result to generate profile-admin.pug template
		*		if failed, print error to console
		*	NOTE
		*		this page is currently not formatted, requires aesthetic overhaul
		*/
		const queryRes = await client.query(text, values)

		if(loggedInUserID.rows[0].user_id == queryRes.rows[0].user_id){
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
				phone: queryRes.rows[0].phone,
				insert_link: '/advocate-admin/' + req.params.user_id + '/user-insert', 
				list_link: '/advocate-admin/' + req.params.user_id + '/page-list',
				logout: '/logout'
			});
		}
		else{
			res.render('unauthorized');
		}		
		
	} catch(e) {
		res.send(queryErr);
	}
});


router.get('/:user_id([0-9]+)/user-insert', function(req, res) {
	res.render('user-insert', {
		title: 'Advocate ' + req.params.user_id + ' client creation', 
		userAction: '/advocate-admin/' + req.params.user_id + '/user-insert',
		back: '/advocate-admin/' + req.params.user_id
	});
});
/*
*	/user_id/user-insert
*	file:		/views/confirm.pug
*	function:	POST
*	submit user account details to database
*/
router.post('/:user_id([0-9]+)/user-insert', async (req, res) =>{
	try{
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
	const queryRes = await client.query(query)
		res.render('confirm', {
			message: 'Data submitted successfully', 
			status: queryRes
		});
	} catch(e) {
		res.render('confirm', {
			message: 'Error, submission failed', 
			status: queryErr
		});
	}
}); 
/*
*	/user_id/page-insert
*	file:		/views/page-inser.pug
*	function:	GET
*	user interface to fill out information to create a new user account
*/

/*
*	/user_id/page-list
*	file:		/views/advocate-pages.pug
*	function:	GET
*	return list of all family pages associated with every family account
*/
router.get('/:user_id([0-9]+)/page-list', async (req, res) =>{
	try{
		//build select query
		const queryRes = await client.query('SELECT family_id, page_name, donation_goal, deadline, status FROM Page_Details')
		/*
		*	query database
		*		if successful, use query result to generate advocate-pages.pug template
		*		if failed, print error to console
		*/
		
		res.render('advocate-pages', {
			headers: ['family_id', 'page_name', 'donation_goal', 'deadline', 'status'], 
			body: queryRes.rows,
			back: '/advocate-admin/' + req.params.user_id
		});
		
	} catch(e) {
		res.send(queryErr);
	}
})
/*
*	/user_id/edit/page_name
*	file:		/views/page-review.pug
*	function:	GET
*	attach review to pending family page
*/
router.get('/review/:family_id([0-9]+)/:page_name', async (req, res) =>{
	try{
		// save the id to access when we want to go back to the page list
		var email = (JSON.stringify(req.oidc.user.email)).replace(/"/g, "'");
		const idQuery = await client.query('SELECT user_id FROM User_Account WHERE email = ' + email);

		//build select query
		var text = 'SELECT * FROM page_details WHERE family_id = $1 AND page_name = $2';
		//set condition values
		var values = [req.params.family_id, req.params.page_name];
		/*
		*	query database
		*		if successful, use query result to generate page-review.pug template
		*		if failed, print error to console
		*/
		const queryRes = await client.query(text, values)
		res.render('page-review', {
			title: req.params.page_name,
			family_id:req.params.family_id,  
			page_name: req.params.page_name,
			visitation_date: queryRes.rows[0].visitation_date, 
			visitation_location: queryRes.rows[0].visitation_location, 
			vistitation_description: queryRes.rows[0].visitation_description, 
			funeral_date: queryRes.rows[0].funeral_date, 
			funeral_location: queryRes.rows[0].funeral_location, 
			funeral_description: queryRes.rows[0].funeral_description, 
			donation_goal: queryRes.rows[0].donation_goal, 
			deadline: queryRes.rows[0].deadline, 
			obituary: queryRes.rows[0].obituary,
			back: '/advocate-admin/' + idQuery.rows[0].user_id + '/page-list'
		})
	} catch(e) {
		res.send('Something went wrong!');
	}
});

//export modules for user in server.js
module.exports = router;