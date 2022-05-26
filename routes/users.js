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
const userController = require('../controllers/users');
const User = require('../models/user')
const Account = require('../models/account')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const ExpressError= require('../utils/ExpressError')

router.get('/register', function(req, res, next){
  res.render('signUp');
})

router.post('/register', upload.any('frontImage', 'backImage'), catchAsync(userController.createUser), function(req, res, next){
  //console.log(req.body);
  //console.log(req.files);
})

router.get("/login", function(req, res, next) {
  req.session.destroy();
  res.render('login');
})


router.get('/firstTime',catchAsync(async (req, res, next) => {
  const userAccount = await  Account.findOne({username: req.session.userAccount})
  //console.log("UserAccount ID", userAccount._id);
  const user = await User.findOneAndUpdate({email: req.session.email}, {accounts: userAccount._id})
  const email = req.session.email;
  
  res.render('changePassFirstTime');
}))

router.post('/firstTime', catchAsync(async (req, res, next) => {
  const firstPassword = req.body.firstPassword;
  const secondPassword = req.body.secondPassword;
  if(firstPassword !== secondPassword) throw new ExpressError('Password does not match', 400)
  
  const userAccount = await  Account.findOne({username: req.session.userAccount})
  //console.log(firstPassword, secondPassword);
  bcrypt.hash()
  res.redirect('/')
}))

router.use((err, req, res, next) =>{
  const {statusCode = 500, message = 'Something went wrong'} = err;
  res.status(statusCode).send(message);
})

module.exports = router;
