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
const prisma = require('../database.js'); 			//load database connection
const buildInsert = require('./../query-builder.js');	//load function to build query INSERT statements
const queryErr = 'An error has occurred'
var axios = require("axios").default;
/*
*	/user_id
*	file:		/views/profile-family.pug
*	function:	GET
*	returns user profile based on id
*/
router.get('/:user_id', async (req, res) =>{

  const loggedInUserID = await prisma.userAccount.findFirst({ where: {email: req.oidc.user.email} });
            
	try{
		/*
		*	query database
		*		if successful, use query result to generate profile-admin.pug template
		*		if failed, print error to console
		*	NOTE
		*		this page is currently not formatted, requires aesthetic overhaul
		*/
		const queryRes = await prisma.userAccount.findFirst({ where: {cuid: req.params.user_id} });

		if(loggedInUserID.cuid == queryRes.cuid || loggedInUserID.user_role == queryRes.user_role){
      const middleName = queryRes.middle_name ? ` ${queryRes.middle_name} ` : " "
			res.render('profile-admin', {
				profileName: `${queryRes.first_name}${middleName}${queryRes.last_name}`, 
				email: queryRes.email, 
				phone: queryRes.phone,
				list_link: '/advocate-admin/' + req.params.user_id + '/page-list',
				invite_link:'/advocate-admin/' + req.params.user_id + '/user-insert', 
				logout: '/logout'
			});
		}
		else{
			res.render('unauthorized');
		}		
		
  } catch (e) {
		console.error(e); res.send(e);
	}
});


router.get('/:user_id/user-insert', function(req, res) {
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

//"result_url":"",
const email_verification = () => request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

router.post('/:user_id/user-insert', async (req, res) =>{
	//req.body = {email: "", name: ""}
	delete req.body.submit
    
	//sets up request for password reset, copied from auth0 website, uses axios (idk what that does)
	
  try {
    // get a token for mgmt api
    const { data: token } = await axios.request({
      method: 'POST',
      url: `${process.env.ISSUER}/oauth/token`,
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AUTH0_MGMT_CLIENTID,
        client_secret: process.env.AUTH0_MGMT_SECRET,
        audience: `${process.env.ISSUER}/api/v2/`
      })
    });
     
    // create user in auth0
    const userCreate = await axios.request({
      method: 'POST',
      url: `${process.env.ISSUER}/api/v2/users`,
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'content-type': 'application/json'
      },
      data: {
        email: req.body.email,
        password: "asd",
        connection: 'Username-Password-Authentication'
        }
    })
    // initiate a change password request for that user
    const passwordReset = await axios.request({
      method: 'POST',
      url: `${process.env.ISSUER}/dbconnections/change_password`,
      headers: {'content-type': 'application/json'},
      data: {
        client_id: `${process.env.AUTH0_MGMT_CLIENTID}`,
        email: req.body.email,
        connection: 'Username-Password-Authentication'
        }
    })
    //console.log(passwordReset)
    await prisma.userAccount.create({ data: req.body })
		const queryRes = await prisma.userAccount.findFirst({ where: {cuid: req.params.user_id} });
    const middleName = queryRes.middle_name ? ` ${queryRes.middle_name} ` : " "
    res.render('profile-admin', {
      profileName: `${queryRes.first_name}${middleName}${queryRes.last_name}`, 
      email: queryRes.email, 
      phone: queryRes.phone,
      list_link: '/advocate-admin/' + req.params.user_id + '/page-list',
      invite_link:'/advocate-admin/' + req.params.user_id + '/user-insert', 
      logout: '/logout'
    });
  } catch (e) {
		console.error(e); 
		res.render('failed', {});
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
router.get('/:user_id/page-list', async (req, res) =>{
	try{
		//build select query
    const queryRes = await prisma.page.findMany({
      where: {
        familyCuid: req.params.user_id
      }
    })
		/*
		*	query database
		*		if successful, use query result to generate advocate-pages.pug template
		*		if failed, print error to console
		*/

		res.render('advocate-pages', {
			items: queryRes,
			back: '/advocate-admin/' + req.params.user_id
		});
		
	} catch(e) {
		console.error(e); res.send(e);
	}
})
/*
*	/user_id/edit/page_name
*	file:		/views/page-review.pug
*	function:	GET
*	attach review to pending family page
*/
router.get('/:family_id([0-9]+)/edit/:page_name', async (req, res) =>{
	try{
		// save the id to access when we want to go back to the page list
    const idQuery = await prisma.userAccount.findFirst({
      where: {
        email:req.oidc.user.email
      }
    })

    const queryRes = await prisma.page.findFirst({
      where: {
        page_name: req.params.page_name,
        familyCuid: req.params.family_id
      }
    })
		res.render('page-review', {  
			...queryRes,
			title: req.params.page_name,
			family_id:req.params.family_id,
			back: '/advocate-admin/' + idQuery.cuid + '/page-list'
		})
	} catch(e) {
		res.send('Something went wrong!');
	}
});


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