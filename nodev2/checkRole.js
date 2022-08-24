const express = require('express');			//load express for front-end and routes
const client = require('./database.js');	//load database connection

module.exports = function () {
  return async function checkRole (req, res, next) {
    console.log('Checking user role...')
    try{
      userEmail = (JSON.stringify(req.oidc.user.email)).replace(/"/g, "'");
      const text = 'SELECT user_role, user_id FROM User_Account WHERE email = ' + userEmail;
      const queryRes = await client.query(text)
            
      if(queryRes.rows[0] != null){
        
        if (queryRes.rows[0].user_role == 1){
          console.log(`${userEmail}` + ' is a family account');
          res.render('unauthorized');
        }
        else if(queryRes.rows[0].user_role == 2){
          console.log(`${userEmail}` + ' is an admin account');
          return next(); 
        }
      }
      // Query Error -> user ID does not exist, redirect and change error message
      else{
        theErrorMessage = "User ID does not exist";
        res.send(theErrorMessage);
      }
    } catch(e){
      res.send('Error in query');
    }
    
  };
};
