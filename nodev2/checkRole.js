const prisma = require("./database.js")
module.exports = function () {
  return async function checkRole (req, res, next) {
    console.log('Checking user role...')
    try{
      const queryRes = await prisma.userAccount.findFirst({
        where: {
        email: req.oidc.user.email
      }})
            
      if(queryRes){
        
        if (queryRes.user_role == "family"){
          console.log(`${req.oidc.user.email}` + ' is a family account');
          res.render('unauthorized');
        }
        else if(queryRes.user_role == "advocate"){
          console.log(`${req.oidc.user.email}` + ' is an admin account');
          return next(); 
        }
      }
      // Query Error -> user ID does not exist, redirect and change error message
      else{
        theErrorMessage = "User ID does not exist";
        res.send(theErrorMessage);
      }
    } catch (e) {
      console.error(e)
      res.send('Error in query');
    }
    
  };
};
