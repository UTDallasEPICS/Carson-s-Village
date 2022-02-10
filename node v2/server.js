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

const routeLogin = require('./routes/login.js');					//load login route
const routeGeneral = require('./routes/general.js');				//load general route
const routeAdvocateAdmin = require('./routes/advocate-admin.js');	//load advocate-admin route
const routeFamily = require('./routes/family.js');					//load family route

app.use(express.urlencoded({extended: false}));						//set body-parser
app.set('view engine', 'pug');										//set view engine to pug

client.connect();													//connect to database

client.query('SELECT NOW()')										//check database connectivity
	.then(res => console.log(res.rows[0]))
	.catch(err => console.error(err.stack));

app.get('/', function(req ,res) {									//redirect root url to login
	res.redirect('/login');
});

app.use('/login', routeLogin);										//route login functions

app.use('/general', routeGeneral);									//route general functions

app.use('/advocate-admin', routeAdvocateAdmin);						//route advocate-admin functions

app.use('/family', routeFamily);									//route family functions

app.listen(port, function() {										//set server to run contiously on port 3000
	console.log('Listening on port ' + port + '...');
});