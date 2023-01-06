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
const prisma = require("../database.js")
/*
*	function:	GET
*	retrieve the user's authenticated email and find their role
* 	based on their role, lead them to their role-specific page
*/
router.get("/", async(req, res) =>  {
	// Parsed email is in the format "evelynkha@yahoo.com" so we replace double quote with single

	// perform a query using the email
	try{
    const queryRes = await prisma.userAccount.findFirst({
      where:{ email: req.oidc.user.email}
    })
		
		if(queryRes != null){
			/*
			*	an access level of 1 denotes a family and generates a family profile
			*	an access level of 2 denotes an advocate/admin and generates an admin profile
			*/

			if (queryRes.user_role == "family"){
				res.redirect('/family/' + queryRes.cuid);
			}
			else if(queryRes.user_role == "advocate"){
				res.redirect('/advocate-admin/' + queryRes.cuid);
			}
		}
		// Query Error -> user email does not exist in database, but does exist in auth0
		else{

			// generate user-info.pug
			res.render('user-info', {
				// upon submit, redirect to this url
				userAction: '/roleSelect/user-info'
			});

		}
  } catch (e) {
    console.error(e)
		res.send('Error in query');
	}
	
});

/*
*	/roleSelect/user-info
*	function:	POST
*	submit user account details to database using query-builder.js
*/
router.post('/user-info', async (req, res) =>{
	try{
		const email = req.oidc.user.email
		// choosing role based on email
		const role = email.toLowerCase().includes("@carsonsvillage.org") ? "advocate" : "family"
    const user = await prisma.userAccount.create({
      data: {
      email, user_role: role
    }})
		// redirect the user to their designated home page
    res.redirect(role == "advocate" ? `/advocate-admin/${user.cuid}` : `/family/${user.cuid}`)
	
	} catch(e) {

		res.render('confirm', {
			message: 'Error, submission failed. Please fill in the required fields', 
		});
	}
		
});



//export modules for user in server.js
module.exports = router;
