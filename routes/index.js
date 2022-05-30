var express = require('express');
var router = express.Router();
const Account = require('../models/account')
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');

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


router.get('/', catchAsync(isAdmin), async function(req, res, next) {
  const accounts = await Account.find({}).sort('-date')
  res.render('mainLayout', {accounts});
});

router.get('/validated', catchAsync(isAdmin), async function(req, res, next) {
  ///const accounts = await Account.find();
  
  const accounts = await Account.find({state: "validated"}).sort('-date')
  

  res.render('mainLayout', {accounts});
});

router.get('/notValidated', catchAsync(isAdmin), async function(req, res, next) {
  const accounts = await Account.find({state: "notValidated"})
  res.render('mainLayout', {accounts});
});

router.get('/disabled', catchAsync(isAdmin), async function(req, res, next) {
  const accounts = await Account.find({state: "disabled"}).sort('-date')
  res.render('mainLayout', {accounts});
});

router.get('/locked', catchAsync(isAdmin), async function(req, res, next) {
  const accounts = await Account.find({state: "locked"}).sort('-date')
  res.render('mainLayout', {accounts});
});


module.exports = router;
