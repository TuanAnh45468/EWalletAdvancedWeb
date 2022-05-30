var express = require('express');
var router = express.Router();
const Account = require('../models/account')
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');

const isLoggin = (req, res, next) =>{
  if(!req.session.userId){
    return res.redirect('/users/login')
  }
  next();
}

const isAdmin = async (req, res, next) => {
  //console.log(req.session.userId);
  const account = await Account.findById({_id: mongoose.Types.ObjectId(req.session.userId)}, function(err, result){
    if (err) {
      console.log(err);
    }
    if(result.role == 'ADMIN'){
      next();
    }
    else {
      return res.redirect('/users')
    }
    //console.log(result);
  }).clone()
}


router.get('/', isLoggin, catchAsync(isAdmin), async function(req, res, next) {
  const accounts = await Account.find({}).sort('-date')
  res.render('mainLayout', {accounts});
});

router.get('/validated', isLoggin, catchAsync(isAdmin), async function(req, res, next) {
  ///const accounts = await Account.find();
  
  const accounts = await Account.find({state: "validated"}).sort('-date')
  

  res.render('mainLayout', {accounts});
});

router.get('/notValidated', isLoggin, catchAsync(isAdmin), async function(req, res, next) {
  const accounts = await Account.find({state: "notValidated"})
  res.render('mainLayout', {accounts});
});

router.get('/disabled', isLoggin, catchAsync(isAdmin), async function(req, res, next) {
  const accounts = await Account.find({state: "disabled"}).sort('-date')
  res.render('mainLayout', {accounts});
});

router.get('/locked', isLoggin, catchAsync(isAdmin), async function(req, res, next) {
  const accounts = await Account.find({state: "locked"}).sort('-date')
  res.render('mainLayout', {accounts});
});


module.exports = router;
