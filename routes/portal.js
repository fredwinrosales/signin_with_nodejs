var express = require('express');
var router = express.Router();

var model = require('../models/user');

router.get('/', function(req, res) {
  res.render('pages/index', {
    'success': req.flash('success')
  });
});

router.post('/sign-in', function(req, res) {
	model.api(req.body).then(function(obj) {
    req.flash('success', 'Registration successfully');
    res.redirect('/');
	}).catch(function(err) {
		console.error(err);
	});
});

module.exports = router;