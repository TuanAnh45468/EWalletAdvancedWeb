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
const {changePassFirstSchemas} = require('../schemas.js');
const { default: mongoose} = require('mongoose');
const History = require('../models/history')

const isLoggin = (req, res, next) =>{
  if(!req.session.userId){
    return res.redirect('/users/login')
  }
  next();
}

const isValidate = (req, res, next) =>{
  if(req.session.state == "notValidated"){
    
  }
}

const validateChangePassFirst = (req, res, next) =>{
  const {error} = changePassFirstSchemas.validate(req.body);

  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
} 

router.get('/', function(req, res, next) {
  res.render('mainLayoutUser')
})

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

router.post('/login', async function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  //console.log(password);
  const account = await Account.findOne({username: username})
  const hash = account.password;

  bcrypt.compare(password, hash, function(err, result) {
    console.log(result);
    if(result == true){
      req.session.state = account.state;
      req.session.userId = account._id;
      res.redirect('/users')
    } else {
      res.redirect('/users/login')
    }
  });

})

router.get('/logout', function(req, res, next) {
  req.session.userId = null;
  req.session.destroy();
  res.redirect('/users/login')
})

router.get('/firstTime', catchAsync(async (req, res, next) => {
  const userAccount = await  Account.findOne({username: req.session.userAccount})
  const user = await User.findOneAndUpdate({email: req.session.email}, {accounts: userAccount._id})
  const email = req.session.email;
  res.render('changePassFirstTime');
}))

router.post('/firstTime', validateChangePassFirst, catchAsync(async (req, res, next) => {
  const firstPassword = req.body.firstPassword;
  const secondPassword = req.body.secondPassword;
  if(firstPassword !== secondPassword) throw new ExpressError('Password does not match', 400)

  const userAccount = await  Account.findOne({username: req.session.userAccount})

  bcrypt.hash(firstPassword, saltRounds, function(err, hash) {
    userAccount.password = hash;
    userAccount.save();
  })
  res.redirect('/users');
}))

router.get('/transferMoney', isLoggin, (req, res, next) =>{
  res.render('transferMoney');
})

router.get('/updateProfile', isLoggin, async (req, res, next) =>{
  //const account = req.session.userId;
  const user = await User.findOne({accounts: req.session.userId})
  res.render('updateProfile', {user});
})

router.post('/updateProfile', async (req, res, next) =>{
  const {name, phoneNumber, email, address, birthday} = req.body;
  //const account = req.session.userId;
  const user = await User.findOne({accounts: req.session.userId})
  
  user.name = name;
  user.phoneNumber = phoneNumber;
  user.email = email;
  user.address = address;
  user.birthday = birthday;
  user.save()
  res.redirect('/users');
})

router.get('/userProfile', isLoggin, catchAsync(async(req, res, next) =>{
  //console.log(req.session.userId);
  const user = await User.findOne({accounts: req.session.userId})
  //console.log(user.images[0].url);
  //console.log(user);

  res.render('userProfile', {user})
}))

router.get('/changePass', isLoggin, (req, res, next) => {
  res.render('changePass');
})

router.post('/changePass', isLoggin, catchAsync( async (req, res, next) => {
  const accountId = req.session.userId;
  const {oldPassword, newPassword, confirmPassword} = req.body;
  const account =  await Account.findById(accountId);

  bcrypt.compare(oldPassword, account.password,async function(err, isCorrectPass){
    if(isCorrectPass){
      if(newPassword == confirmPassword){
          bcrypt.hash(confirmPassword, saltRounds,async function(err, hash){
          account.password = hash;
          account.save();
        })
        res.redirect('/users');
      }
    }
    res.redirect('/users/changePass')
  })
  
}))

router.get('/otp', (req, res, next) =>{
  res.render('enterOTP')
})

router.post('/otp', (req, res, next) =>{
  const confirmOtp = req.body.otp;
  if(confirmOtp == req.session.otp){
    res.redirect('/users/restore')
  } else {
    res.redirect('/users/otp')
  }
})

router.get('/restore', (req, res, next) =>{
  res.render('restorePass')
})

router.post('/restore',async (req, res, next) =>{
  const {newPassword, confirmPassword} = req.body;
  const user = await User.findOne({email: req.session.email})
  //console.log(user.accounts[0]);
  const account = await Account.findById(user.accounts)

  if (newPassword == confirmPassword) {
    bcrypt.hash(newPassword, saltRounds, function(err, hash){
      if (err) {
        console.log(err, "Not Found Account");
      }
      account.password = hash;
      account.save();
    })
    res.redirect('/users/login')
  }

  res.redirect('/users/restore')
})

router.get('/email', (req, res, next) =>{
  res.render('enterEmail')
})

router.post('/email', catchAsync(userController.sendOTP), function (req, res, next) {
  
})

router.get('/validate/:id', async (req, res, next) =>{
  const id = req.params;
  const account = await Account.findById({_id: mongoose.Types.ObjectId(id)}, function(err, result){
    if(err){
      console.log(err);
    } else {
      result.state = "validated"
      result.save();
    }
  }).clone()
  return res.redirect('/validated')
})

router.get('/lock/:id', async (req, res, next) =>{
  const id = req.params;
  const account = await Account.findById({_id: mongoose.Types.ObjectId(id)}, function(err, result){
    if(err){
      console.log(err);
    } else {
      result.state = "locked"
      result.save();
    }
  }).clone()
  return res.redirect('/locked')
})

router.get('/reup/:id', async (req, res, next) =>{
/*   const id = req.params;
  const account = await Account.findById({_id: mongoose.Types.ObjectId(id)}, function(err, result){
    if(err){
      console.log(err);
    } else {
      result.state = "validated"
      result.save();
    }
  }).clone() */
  return res.redirect('/')
})

router.get('/unlock/:id', async (req, res, next) =>{
  const id = req.params;
  const account = await Account.findById({_id: mongoose.Types.ObjectId(id)}, function(err, result){
    if(err){
      console.log(err);
    } else {
      result.state = "validated"
      result.save();
    }
  }).clone()
  return res.redirect('/validated')
})

router.get('/:id', async (req, res, next) =>{
  const accountId = req.params;
  const account = await Account.findById(mongoose.Types.ObjectId(accountId))
  const user = await User.findOne({accounts: mongoose.Types.ObjectId(accountId)})
  res.render('userProfile', {user, account})
})


// router.use((err, req, res, next) =>{
//   const {statusCode = 500} = err;
//   if(!err.message) err.message = 'Oh no no, something went wrong';
//   res.status(statusCode).render('error', {err});
// })

module.exports = router;
