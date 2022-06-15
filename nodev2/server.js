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

const client = require('./database.js');							//load database connection

// import openid-connect module
const { auth } = require('express-openid-connect');

// make all variables defined in .env available to us under process.env
require('dotenv').config()

const secured = require('./secured');
const checkRole = require('./checkRole.js');

// tells us how to connect to auth0 open id provider
const config = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.SECRET,
	baseURL: process.env.BASEURL,
	clientID: process.env.CLIENTID,
	issuerBaseURL: process.env.ISSUER
};

// auth router attaches /login, /logout, and /callback routes to the baseURL 
// middleware code
app.use(auth(config));

// set current directory into views folder
app.use(express.static('./views'));

const routeLogin = require('./routes/roleSelect.js');					//load login route
const routeSearch = require('./routes/search.js');					//load search route
const routeAdvocateAdmin = require('./routes/advocate-admin.js');	//load advocate-admin route
const routeFamily = require('./routes/family.js');					//load family route

app.use(express.urlencoded({extended: false}));						//set body-parser
app.set('view engine', 'pug');										//set view engine to pug

client.connect();													//connect to database

client.query('SELECT NOW()')										//check database connectivity
	.then(res => console.log(res.rows[0]))
	.catch(err => console.error(err.stack));

// redirect root url to auth0 login page if the user is not logged in yet
// otherwise, let them go to their role page
app.get('/', function(req ,res) {	
	console.log(req.oidc.isAuthenticated());	
	if(req.oidc.isAuthenticated() == false)							
		res.redirect('/login');
	else
		res.redirect('/roleSelect');
		// res.redirect('/logout');

});

app.use('/roleSelect', secured(), routeLogin);										//route login functions

app.use('/search', secured(), routeSearch);									//route search functions

app.use('/advocate-admin', secured(), routeAdvocateAdmin);						//route advocate-admin functions

app.use('/family', secured(), checkRole(), routeFamily);									//route family functions

app.get('*', (req, res) => {
	res.redirect('/login');
});

app.listen(port, function() {										//set server to run contiously on port 3000
	console.log('Listening on port ' + port + '...');
});