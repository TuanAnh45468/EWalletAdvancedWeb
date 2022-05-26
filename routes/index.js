var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('mainLayout', { title: 'Express' });
});

router.get("/changePass", function(req, res, next) {
  res.render('changePass');
})


router.get("/transferMoney", function(req, res, next) {
  res.render('transferMoney');
})

router.get("/updateProfile", function(req, res, next) {
  res.render('updateProfile');
})

module.exports = router;
