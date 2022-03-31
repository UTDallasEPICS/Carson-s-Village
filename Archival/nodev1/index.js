/*
*   Declare required packages
*   Set references to important objects
*   Note: body-parser is deprecated
*/
const express = require('express');                     //load express server to handle manage web application
const bodyParser = require('body-parser');              //load bodyParser to parse data input
const app = express();                                  //define experss application
const port = 3000;                                      //define port on local host
/*
*   Set database credentials
*   Note: requires access token in future
*   Note: credentials should not be publically accessible
*/
const {Client, Connection} = require('pg');                         //define postgresql connection
const client = new Client({                             //initialize postgresql connection
    user: 'postgres',                                   //identify with \conninfo on the postgresql terminal
    host: 'localhost', 
    database: 'EPICS_Project', 
    password: 'postgres', 
    port: 5432
});
/*
*   Initialize server resources
*/
app.use(express.static(__dirname));                     //set as root directory of node files
//app.use(bodyParser.urlencoded({extended:false}));       //use deprecated body parser
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'pug');                          //use PUG as website template for confirmation page
/*
*   Defines the "homepage" of the web application
*/
app.get('/', function(req, res) {                       //route to root '/' on localhost:3000
    res.sendFile('index.html', {root: __dirname});      //display index.html file from root directory of node files
});
/*
*   Fetch query from databas
*   Display query from database
*/
app.get('/users', function(req, res) {
    client.query("SELECT * FROM User_Account ORDER BY user_id ASC", function(err, values) {
        //console.log(values.rows);
        if (err) throw err 
            res.render('user', {
                title: 'User details', 
                items: values.rows,                     //iterate through returned collection
                url: '/?'                               //return to homepage, root directory
            });
    });
});
/*
*   Initiate database connection
*/
client.connect();                                       //connect to postgresql database
client.query('SELECT NOW()')                            //identify current time
    .then(res => console.log(res.rows[0]))              //confirm operation
    .catch(e => console.error(e.stack));                //define error
/*
*   Define submission of Html form
*/
app.post('/submit', function(req, res) {                            //submit items in form
    /*
    *   Attempt to insert values into database
    */
    var insertStatement = "INSERT INTO User_Account (user_id, email, user_role, password_hash, password_salt, first_name, middle_name, last_name, phone) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)";
    var insertValues = [req.body.user_id, req.body.email, req.body.user_role, req.body.password_hash, req.body.password_salt, req.body.first_name, req.body.middle_name, req.body.last_name, req.body.phone];
    /*
    *   Check for errors
    *   If no errors, display success page
    *   If errors found, display first available error in failure page
    */
    client.query(insertStatement, insertValues)                     //insert query based on insertStatement and inserValues
        .then(queryValue => {                                       //confirm operation
            console.log(queryValue.command + "\n" + insertValues);  //log results to console
            res.render('confirm', {                                 //generate template page
                title: 'Submission Status', 
                message: 'Data submitted successfully'
            });
        })
        .catch(error => {                                           //define error
            console.error(error);                                   //log error in console
            res.render('confirm', {                                 //generate template page
                title: 'Submission Status', 
                message: 'Error, submission failed',
                status: error                                       //print error to screen
            });
        });
});
/*
*   Confirm running of application
*/
app.listen(port, function() {                           //verify application is running
    console.log('Example app listening on port 3000');  //log confirmation to console
});
