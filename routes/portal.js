var express = require('express');
var router = express.Router();
var validate = require('express-validation');
var model = require('../models/user');

router.get('/', function(req, res) {

        var locals = res.locals;

        locals.rc = req.flash('rc');
        locals.message = req.flash('msg');

        res.render('pages/index');

});

router.post('/sign-in', validate(validation.signin), function(req, res) {

        model.api(req.body).then(function(obj) {

        console.log(obj.data);
        req.flash('rc', obj.data.rc);
        req.flash('msg', obj.data.msg);
        res.redirect('/');

        }).catch(function(err) {

        console.error(err);

        });
});

module.exports = router;