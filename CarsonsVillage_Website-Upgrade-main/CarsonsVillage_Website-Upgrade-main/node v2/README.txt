Purpose:
Create graphical user interface from which to insert data into the User_Account table of the database

Required: 
* NodeJS v6.14.12
  * Express
  * pg
  * body-parser
  * pug
* PostgreSQL v13.2

Installation:
  npm install express
  npm install pg
  npm install body-parser
  npm install pug

Run Command: 
 node server.js
 (perform from directory containing server.js)
  
Other Notes: 
* Ensure that PostgreSQL server is running
* Ensure that all files are organized in given directory format

Bugs: 
* Any error in submission, regardless of relation to the database, will trigger the error page
* All database insert errors only report the first noted error
* Links on confirmation do not work

Current and Planned Prototype Functions: 
- Index
	- '/' 
		- redirects to login page
	- Login
- General
	- '/general/user-search'
		- search users based on name and role
		- return user id and name
	- Planned functions
		- Display client pages
			- Display image carousel
			- Format page CSS
		- Search client pages based on page name
- Login
	- '/login/' 
		- checks user email and role
		- loads relevant profile page
	- '/login/error'
		- user credentials invalid
		- reloads login page and displays error
	- Planned functions
		- Password check/verification
		- Sending tokens for verification
		- Okta login service? 
- Family
	- '/family/:userid([0-9]+)'
		- loads family name, email, and phone based on provided user id
		- link to page creation
		- link to list of existing family pages
	- '/family/:userid([0-9]+)/page-list'
		- loads page name, donation goal, and deadline based on provided user id
	- '/family/:userid([0-9]+)/page-insert'
		- insert all page_details information for current user id
	- '/family/:user_id([0-9]+)/edit/:page_name'
		- edit pending page
	- Planned functions
		- Upload page edits to database
		- Upload/store pictures
- Admin
	- '/advocate-admin/:user_id([0-9]+)'
		- loads advocate name, email, and phone based on provided user id
		- links for user account creation and list of all pages
	- '/advocate-admin/:user_id([0-9]+)/user-insert'-
		- insert all user_account information for new user 
	- '/advocate-admin/:user_id([0-9]+)/page-list'-
		- list all existing client pages
	- '/advocate-admin/review/:user_id([0-9]+)/:page_name'
		- attach review to pending page
	- Planned functions
		- ability to edit/enable/disable pages
		- ability to terminate users
		- submit review logs to database
- Other planned functions
	- View donations
	- Extract donations
	- Display comments
	- Logging
	- Security for GET requests, limit functions based on user role
