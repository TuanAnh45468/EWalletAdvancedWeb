if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

//console.log(process.env.SECRET);
var express = require('express');
var router = express.Router();
const multer = require('multer');
const {storage} = require('../cloudinary/index');
const upload = multer({storage});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next){
  res.render('signUp');
})

router.post('/register', upload.any('frontImage', 'backImage'), function(req, res, next) {
  console.log(req.body);
  res.send(req.files);
})

module.exports = router;
