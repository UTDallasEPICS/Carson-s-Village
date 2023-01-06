/*
*	David Hong
*	ECS 3200
*	Carson's Village: Automated Family Page
*	family.js
*		Denotes functions specific to family accounts
*		Located under "/family/"
*/
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3')
const s3 = new S3Client({region: 'us-east-2'});
const shortid = require('shortid');
const express = require('express');						//load express for front-end and routes
const router = express.Router();						//load express router
const prisma = require("../database.js")
const upload = multer({									//Sets up the parameters to upload an image(s) to S3 via Multer-S3
	storage: multerS3({
	s3: s3,
	bucket: process.env.AWS_S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
	cb(null, {fieldName: file.fieldname});
	},
})
,
  key: function (req, file, cb) {
	cb(null, shortid.generate() + "-" + file.originalname);			//Sets random key for user uploaded image files.
},
	fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
}
})

const checkFileType = (file, cb) => {				//Makes sure that the user uploads an image.
	const filetypes = /jpeg|jpg|png|gif/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);
  
	if (mimetype && extname) {
	  return cb(null, true);
	} else {
	  cb("Please upload images only (a file type of jpeg, jpg, png, or gif.)");
	}
}

const buildInsert = require('./../query-builder.js');	//load function to build query INSERT statements
const path = require('path');
const queryErr = 'An error has occurred'
/*
*	/user_id
*	file:		/views/profile-family.pug
*	function:	GET
*	returns user profile based on id
*/
router.get('/:user_id', async (req, res) =>{
	try{
		
		const user = await prisma.userAccount.findFirst({
      where: {email: req.oidc.user.email}
    })

		const queryRes = await prisma.userAccount.findFirst({
      where: {cuid: req.params.user_id}
    })

		if(user.cuid == queryRes.cuid || (user.user_role == "advocate" && queryRes.user_role == "family")){

			//build name
			var name = queryRes.first_name;					//attach first name	
			if(queryRes.middle_name != null)				//check for middle name
			{
				name = name + ' ' + queryRes.middle_name;	//attach middle name
			}
			name = name + ' ' + queryRes.last_name;			//attach last name
			res.render('profile-family', {
				profileName: name, 
				email: queryRes.email, 
				phone: queryRes.phone, 
				insert_link: '/family/' + req.params.user_id + '/page-insert', 
				list_link: '/family/' + req.params.user_id + '/page-list',
			});
		}
		else{
			res.render('unauthorized');
		}	
	} catch(e){
		console.error(e); res.send(e);
	}
});
/*
*	/user_id/page-list
*	file:		/views/client-pages.pug
*	function:	POST
*	return list of applicable pages associated with the family account
*/
router.get('/:user_id/page-list', async (req, res) =>{
	try{

		const user = await prisma.userAccount.findFirst({
      where: {email:req.oidc.user.email}
    })
		const roleCheck = await prisma.userAccount.findFirst({
      where: {cuid: req.params.user_id}
    })

		// Can access account only if user_id matches OR user is an admin
		if(user.cuid == roleCheck.cuid || (user.user_role == "advocate" && roleCheck.user_role == "family")){

			const queryRes = await prisma.page.findMany({
        where: {familyCuid: req.params.user_id}
      })
			

      queryRes.forEach(row => {
				var reformmatedDate = row.deadline;
				var setupTime = new Date(reformmatedDate);
				var time = setupTime.getUTCHours() + ":" + setupTime.getUTCMinutes() + ":00";
				time = convertTime(time);
				date = reformmatedDate.toString().split(" ");
				date = date[0] + " " + date[1] + " " + date[2];
				row.deadline = date + " " + time
      })
				
			//list all available pages
			res.render('client-pages', {
				items: queryRes,
				back: '/family/' + req.params.user_id
			});
		}
		else{
			res.render('unauthorized');
		}
			 
	} catch(e) {
		console.error(e); res.send(e);
	}
		
});

/*
*	/user_id/page-insert
*	file:		/views/page-insert.pug
*	function:	GET
*	user interface to fill out information to apply for a family page
*/
router.get('/:user_id/page-insert', async(req, res) =>{
	try{
		const user = await prisma.userAccount.findFirst({
      where: {email:req.oidc.user.email}
    })
		const roleCheck = await prisma.userAccount.findFirst({
      where: {cuid: req.params.user_id}
    })
		// Can access account only if user_id matches OR user is an admin

		if(user.cuid == roleCheck.cuid || user.user_role == "advocate"){
			res.render('page-insert', {
				title: 'Family ' + req.params.user_id + ' client creation', 
				userAction: '/family/' + req.params.user_id + '/page-insert',
				back: '/family/' + req.params.user_id
			});
		}
		else{
			res.render('unauthorized');
		}
			 
	} catch(e) {
		console.error(e); res.send(e);
	}

});
/*
*	/user_id/page-insert
*	file:		/views/confirm.pug
*	function:	POST
*	submit family page details to database
*/
router.post('/:user_id/page-insert', upload.array('images'), async (req, res) =>{
	try{
    delete req.body.submit
    const queryRes = await prisma.page.create({
      data: {
        ...req.body,
        day_of_birth: new Date(req.body.day_of_birth),
        day_of_passing: new Date(req.body.day_of_passing),
        visitation_date: new Date(req.body.visitation_date),
        funeral_date: new Date(req.body.funeral_date),
        deadline: new Date(req.body.deadline),
        UserAccount: {
          connect: {
            cuid: req.params.user_id
          }
        },
        Image: {
          createMany: {
            data: processImageUrls(req.files || [])
          }
        }
      }
    })
		res.render('confirm', {
			back: '/family/' + req.params.user_id
		});
		
  } catch (e) {
    console.error(e)
		res.render('failed', {});
	}
});


/*
*	/user_id/edit/page_name
*	file:		/views/page-edit.pug
*	function:	GET
*	return form to edit existing family page
*/
router.get('/:user_id/edit/:page_name', async (req, res) => {
	try{
		const user = await prisma.userAccount.findFirst({
      where: {email:req.oidc.user.email}
    })
		const roleCheck = await prisma.userAccount.findFirst({
      where: {cuid: req.params.user_id}
    })

		// Can access account only if cuid matches OR user is an admin

		if(user.cuid == roleCheck.cuid || user.user_role == "advocate"){
			//build select query
			var text = 'SELECT * FROM page_details WHERE familyCuid = $1 AND page_name = $2';
			//set condition values
			values = [req.params.user_id, req.params.page_name];
			/*
			*	query database
			*		if successful, use query result to generate family-page.pug template
			*		if failed, print error to console
			*/
      const queryRes = await prisma.page.findFirst({
        where: {
          familyCuid: req.params.user_id,
          familyCuid: req.params.user_id,
        }
      })
			//load all details of existing page to edit page, separate field underneath for edits
			res.render('page-edit', {
				title: req.params.page_name, 
				page_name: req.params.page_name,
				media: queryRes.images,
				day_of_birth: queryRes.day_of_birth,
				day_of_passing: queryRes.day_of_passing,
				visitation_date: queryRes.visitation_date, 
				visitation_location: queryRes.visitation_location, 
				visitation_description: queryRes.visitation_description, 
				funeral_date: queryRes.funeral_date, 
				funeral_location: queryRes.funeral_location, 
				funeral_description: queryRes.funeral_description, 
				donation_goal: queryRes.donation_goal, 
				deadline: queryRes.deadline, 
				obituary: queryRes.obituary,
				timezone: queryRes.timezone, 
				editPage: '/family/' + req.params.user_id + '/edit/' + req.params.page_name,
				back: '/family/' + req.params.user_id + '/page-list'
			})
		}
		else{
			res.render('unauthorized');
		}			
	} catch(e) {
		console.error(e); res.send(e);
	}
});

function processImageUrls(urls) {
  return urls.map(u => {
    const split = u.location.split("/")
    return `${process.env.IMAGE_BASE_URL}/${split[split.length - 1]}`
  })
}
/*
*	/user_id/page-insert
*	file:		/views/confirm.pug
*	function:	POST
*	submit family page details to database
*/
router.post('/:user_id/edit/:page_name', upload.array('images') , async (req, res, next) => {
	try{
		delete req.body.submit
    const images = processImageUrls(req.files || [])
    const page = await prisma.page.findFirst({
      where: {
        page_name: req.params.page_name,
        familyCuid: req.params.user_id
      }
    })
    await prisma.$transaction([
      prisma.Image.deleteMany({
        where: {
          pageCuid: page.cuid
        }
      }),
      prisma.page.update({
        where: {
          cuid: page.cuid
        },
        data: {
          ...req.body,
          Images: {
            createMany: {
              data: images.map(url => ({url}))
            }
          }
        }
      }),
    ])
		res.render('confirm', {
			back: '/family/' + req.params.user_id

		});
		
  } catch (e) {
    console.error(e)
		res.render('failed', {});
	}
});

/*
*	/user_id/remove-image
*	file:		/views/family-page.pug
*	function:	POST
*	Deletes family page image from the database.
*/
router.post('/:user_id/remove-image/:page_name' , async (req, res) => {
	try{
		const {cuid:pageCuid,page_name, image} = JSON.parse(req.body.remove);
    await prisma.image.delete({
      where: {
        pageCuid_url: {
          url: image,
          pageCuid
        }
      },
    })
    res.render('image-delete-successful', {
      back: '/search' + '/pages/' + req.params.user_id + '/'  + page_name
    });

  } catch (e) {
    console.error(e)
		res.render('failed', {});
	}
});

/*
	Change date from this format: Tue Jul 26 2022 00:00:00 GMT-0500 (Central Daylight Time)
	to this format: 07/28/2022
*/
function convertDate(str) {
	str = str.toLocaleString();
	str = str.split(",")[0];
	return str;
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

router.get('/:user_id/family-page/:page_name', async (req, res) => {
	try{
		const user = await prisma.userAccount.findFirst({
      where: {email: req.oidc.user.email}
    })
		const roleCheck = await prisma.userAccount.findFirst({
      where: {cuid: req.params.user_id}
    })

		// Can access account only if user_id matches OR user is an admin
		if(user.cuid == roleCheck.cuid || user.user_role == "advocate"){

      const queryRes = await prisma.page.findFirst({
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
      const donation_goal = queryRes.donation_goal;
      const donated_amount = queryRes.amount_raised;
      const donated_percentage = ((donated_amount / donation_goal) * 100).toFixed(1);
    
      const media = page.Images.map(({url}) => url)
			//load all details of existing page to edit page, separate field underneath for edits
			res.render('family-page-public', {
         cuid: queryRes.cuid,
				title: req.params.page_name, 
				page_name: req.params.page_name,
				name: queryRes.page_name,
        media,
        profile: media[0],
				day_of_birth: queryRes.day_of_birth,
				day_of_passing: queryRes.day_of_passing,
				visitation_date: queryRes.visitation_date, 
				visitation_location: queryRes.visitation_location, 
				visitation_description: queryRes.visitation_description, 
				funeral_date: queryRes.funeral_date, 
				funeral_location: queryRes.funeral_location, 
				funeral_description: queryRes.funeral_description, 
				donation_goal: convertDonationAmount(queryRes.donation_goal), 
        donated_amount: convertDonationAmount(donated_amount),
        donated_percentage: donated_percentage,
				deadline: queryRes.deadline, 
				timezone: queryRes.timezone, 
				obituary: queryRes.obituary,
				back: '/family/' + req.params.user_id + '/edit/' + req.params.page_name
			})
		}
		else{
			res.render('unauthorized');
		}	
	} catch(e) {
		console.error(e); res.send(e);
	}
});
function convertDonationAmount(amount){
	var formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
	return formatter.format(amount);
}
//export modules for user in server.js
module.exports = router;