var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/changePass", function(req, res, next) {
  res.render('changePass');
})

router.get("/firsttime", function(req, res, next) {
  res.render('changePassFirstTime');
})

router.get("/login", function(req, res, next) {
  res.render('login');
})

router.get("/transferMoney", function(req, res, next) {
  res.render('transferMoney');
})

router.get("/updateProfile", function(req, res, next) {
  res.render('updateProfile');
})

module.exports = router;
