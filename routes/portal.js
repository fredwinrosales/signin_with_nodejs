var express = require('express');
var router = express.Router();

var model = require('../models/user');

router.get('/', function(req, res) {

        var locals = res.locals;

        locals.rc = req.flash('rc');
        locals.message = req.flash('msg');
        locals.old = req.flash('body');
        locals.validation = req.flash('validation');

        res.render('pages/index');

});

router.get('/braintree', function(req, res) {

        var gateway = braintree.connect({
                accessToken: accessTokenForRecipient
              });
              
              gateway.paymentMethod.grant(
                "the_payment_method_token",
                { allow_vaulting: false, include_billing_postal_code: true },
                function (err, grantResult) {
                  var nonceToSendToRecipient = grantResult.paymentMethodNonce.nonce;
                  // ...
                }
              );
              
});

router.post('/sign-in', function(req, res) {

        model.api(req.body).then(function(obj) {

        console.log(obj.data);

        req.flash('rc', obj.data.rc);
        req.flash('msg', obj.data.msg);
        req.flash('body', obj.data.body);
        req.flash('validation', (typeof obj.data.validation != 'undefined') ? obj.data.validation : '');
        res.redirect('/');

        }).catch(function(err) {

        console.error(err);

        });
});

module.exports = router;