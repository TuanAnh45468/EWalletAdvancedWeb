var express = require('express');
var router = express.Router();
const Account = require('../models/account')

/* GET home page. */
router.get('/validated', async function(req, res, next) {
  ///const accounts = await Account.find();

  const accounts = await Account.find({state: "validated"})

  res.render('mainLayout', {accounts});
});

router.get('/notValidated', async function(req, res, next) {
  const accounts = await Account.find({state: "notValidated"})
  res.render('mainLayout', {accounts});
});

router.get('/disabled', async function(req, res, next) {
  const accounts = await Account.find({state: "disabled"})
  res.render('mainLayout', {accounts});
});

router.get('/locked', async function(req, res, next) {
  const accounts = await Account.find({state: "locked"})
  res.render('mainLayout', {accounts});
});

module.exports = router;
