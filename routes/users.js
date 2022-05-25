if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

//console.log(process.env.SECRET);
var express = require('express');
var router = express.Router();
const multer = require('multer');
const {storage} = require('../cloudinary/index');
const upload = multer({storage});
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');

router.get('/register', function(req, res, next){
  res.render('signUp');
})

router.post('/register', upload.any('frontImage', 'backImage'), catchAsync(users.createUser), function(req, res, next) {

  //console.log(req.body);
  //console.log(req.files);
})

router.get('/firstTime', function(req, res, next){
  res.render('changePassFirstTime');
})

module.exports = router;
