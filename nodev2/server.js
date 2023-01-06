/*
*	David Hong
*	ECS 3200
*	Carson's Village: Automated Family Page
*	server.js
*		Denotes server to route functions
*		Located under "/"
*/
const express = require('express');									//load express for front-end and routes
const app = express();												//set application as express
const port = 3000;													//set port to 3000
const checkRole = require('./checkRole.js');	
const prisma = require("./database.js")
// import openid-connect module
const { auth, requiresAuth } = require('express-openid-connect');

// make all variables defined in .env available to us under process.env
require('dotenv').config()

// tells us how to connect to auth0 open id provider
const config = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.AUTH0_SECRET,
	baseURL: process.env.BASEURL,
	clientID: process.env.AUTH0_CLIENTID,
	issuerBaseURL: process.env.ISSUER,
};

// Stripe API tokens
// const stripePublic = process.env.STRIPE_PUBLIC;
// const stripeSecret = process.env.STRIPE_SECRET;

// auth router attaches /login, /logout, and /callback routes to the baseURL 
// middleware code
app.use(auth(config));

// set current directory into views folder
app.use(express.static('./views'));

const routeAdvocateAdmin = require('./routes/advocate-admin.js');	// load advocate-admin route
const routeDonate = require('./routes/donate.js');					// load donate route
const routeFamily = require('./routes/family.js');					// load family route
const routeLogin = require('./routes/roleSelect.js');				// load login route
const routeSearch = require('./routes/search.js');					// load search route

app.use(express.urlencoded({extended: false}));						// set body-parser
app.set('view engine', 'pug');										// set view engine to pug


// redirect root url to auth0 login page if the user is not logged in yet
// otherwise, let them go to their role page
app.get('/', function(req ,res) {	
	console.log("Authenticated status: " + req.oidc.isAuthenticated());	
	if(req.oidc.isAuthenticated() == false)							
		res.redirect('/login');
	else
		res.redirect('/roleSelect');
});

async function checkEmail(req, res, next) {
	//check email from req.oidc.user.email
	//check if email is in our database
	//if not kick them out
	//if yes then call next()

	//database is sql, use client object
  const advocateText = await prisma.userAccount.findFirst({
    where: {email:req.oidc.user.email}
  })
	if(!advocateText) {
		console.log("log out");
		res.redirect(`${process.env.ISSUER}v2/logout?client_id=${process.env.AUTH0_CLIENTID}&returnTo=${encodeURI('https://www.youtube.com/watch?v=bxqLsrlakK8')}`);
		// never gonna give you up
	} else {
		next();
	}
}

app.use('/roleSelect', routeLogin);										//route login functions

app.use('/search', routeSearch);									//route search functions

app.use('/advocate-admin', requiresAuth(), checkEmail, checkRole(), routeAdvocateAdmin);						//route advocate-admin functions

app.use('/family', requiresAuth(), routeFamily);									//route family functions
app.use('/donate', routeDonate);												// route donate functions

app.listen(port, function() {										//set server to run contiously on port 3000
	console.log('Listening on port ' + port + '...');
});