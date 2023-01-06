/*
*	David Hong
*	ECS 3200
*	Carson's Village: Automated Family Page
*	search.js
*		Denotes functions that do not require family or advocate credentials
*		Located under "/search/"
*/

//Declare required dependencies
const { data } = require('autoprefixer');
const express = require('express');				//load express for front-end and routes
const router = express.Router();				//load express router
const queryErr = 'An error has occurred'
const prisma = require("../database.js")

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
		/*
		*	query database
		*		if successful, use query result to generate user-results.pug template
		*		if failed, print error to console
		*/
    const queryRes = await prisma.userAccount.findMany({
      where: req.body
    })
		res.render('user-results', {
			items: queryRes
		});
	} catch(e) {
		console.error(queryErr.stack);
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
		const queryRes = await prisma.page.findMany({
      where: req.body
    })
		res.render('page-search', {
			items: queryRes
		});
	} catch(e) {
		console.error(e); res.send(e);
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

router.get('/pages/:user_id/:page_name', async (req, res) =>{
  try {
    const page = await prisma.page.findFirst({
      where: {
        familyCuid: req.params.user_id,
        page_name: req.params.page_name
      },
      include: {
        Images: {
          select: {
            url: true
        }
        }
      }
    })

    const donation_goal = page.donation_goal;
    const donated_amount = page.amount_raised;
    const donated_percentage = ((donated_amount / donation_goal) * 100).toFixed(1);
    const media = page.Images.map(({url}) => url)
    const data = {
      cuid: page.cuid,
      title: req.params.page_name, 
      page_name: req.params.page_name,
      name: page.name,
      media,
      funeral_location: page.funeral_location, 
      funeral_description: page.funeral_description, 
      donation_goal: page.donation_goal, 
      donated_amount: convertDonationAmount(donated_amount),
      donated_percentage: donated_percentage,
      deadline: page.deadline, 
      timezone: page.timezone, 
      obituary: page.obituary,
      profile: media[0],
      day_of_birth: page.day_of_birth,
      day_of_passing: page.day_of_passing,
      visitation_date: page.visitation_date,
      visitation_location: page.visitation_location,
      visitation_description: page.visitation_description,
      funeral_date: page.funeral_date,
    }
		if (req.oidc.isAuthenticated() == true) {
			// save the id to access when we want to go back to the page list
      const user = await prisma.userAccount.findFirst({ where: { email:req.oidc.user.email } })
      
			if (user.user_role == "advocate") {
        res.render('family-page', {
          ...data,
					userImageAction: '/family/' + user.cuid + '/remove-image/' + page.page_name,
					back: '/advocate-admin/' + user.cuid + '/page-list',
					userAction: '/donate/create-checkout-session/'
						+ page.familyCuid + '/' + page.page_name
				})
			}
			else {
				res.render('family-page', {
          ...data,
					userImageAction: '/family/' + user.cuid + '/remove-image/' + page.page_name,
					back: '/family/' + user.cuid,
					userAction: '/donate/create-checkout-session/'
						+ page.familyCuid + '/' + page.page_name
				})
			}
		}
		else {
      res.render('family-page-public', {
        ...data,
				userAction: '/donate/create-checkout-session/'
					+ page.familyCuid + '/' + page.page_name
			})
		}
	} catch(e) {
		console.error(e); res.send(e);
	}
})

function convertDate(str) {
	str = str.toLocaleString();
	str = str.split(",")[0];
	return str;
}

function convertDonationAmount(amount){
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
	return formatter.format(amount);
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

/*
	Change text from this format: 2022-07-22T18:05:00.000Z
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

//export modules for user in server.js
module.exports = router;