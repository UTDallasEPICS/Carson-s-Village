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
const client = require('./database.js');							//load database connection

// import openid-connect module
const { auth, requiresAuth } = require('express-openid-connect');

// make all variables defined in .env available to us under process.env
require('dotenv').config()

// tells us how to connect to auth0 open id provider
const config = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.SECRET,
	baseURL: process.env.BASEURL,
	clientID: process.env.CLIENTID,
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

client.connect();													// connect to database

client.query('SELECT NOW()')										// check database connectivity
	.then(res => console.log(res.rows[0]))
	.catch(err => console.error(err.stack));

// redirect root url to auth0 login page if the user is not logged in yet
// otherwise, let them go to their role page
app.get('/', function(req ,res) {	
	console.log("Authenticated status: " + req.oidc.isAuthenticated());	
	if(req.oidc.isAuthenticated() == false)							
		res.redirect('/login');
	else
		res.redirect('/roleSelect');
});

app.use('/advocate-admin', requiresAuth(), checkRole(), routeAdvocateAdmin);	// route advocate-admin functions
app.use('/donate', routeDonate);												// route donate functions
app.use('/family', requiresAuth(), routeFamily);								// route family functions
app.use('/roleSelect', routeLogin);												// route login functions
app.use('/search', routeSearch);												// route search functions

app.listen(port, function() {										//set server to run contiously on port 3000
	console.log('Listening on port ' + port + '...');
});