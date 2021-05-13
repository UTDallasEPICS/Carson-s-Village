var express = require('express');
var router = express.Router();
var multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {

      cb(null, 'images/')
  },
  filename: function (req, file, cb) {
      //let ext = ''; // set default extension (if any)
      //if (file.originalname.split(".").length>1) // checking if there is an extension or not.
          //ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
      cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage });
router.post('/upload', upload.any("file"), function (req,res) {
  //console.log(req.body, 'Body');
  //console.log(req.file, 'file');
  //res.send("Image upload successfull!");
  res.send();
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({message: 'alive'});
});
  
module.exports = router;
