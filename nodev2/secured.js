/**
 * This is an example middleware that checks if the user is logged in.
 *
 * If the user is not logged in, it stores the requested url in `returnTo` attribute
 * and then redirects to `/login`.
 *
 */
module.exports = function () {
  return function secured (req, res, next) {
<<<<<<< Updated upstream
=======
    
>>>>>>> Stashed changes
    if (req.oidc.isAuthenticated()) { 
      console.log('Secured')
      return next(); 
    }
    // req.session.returnTo = req.originalUrl;
    res.redirect('/login');
<<<<<<< Updated upstream
=======
    
>>>>>>> Stashed changes
  };
};
