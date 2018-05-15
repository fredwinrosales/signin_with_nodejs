var express = require('express');
var router = express.Router();

var model = require('../models/user');

router.get('/', function(req, res) {

        var locals = res.locals;

        locals.rc = req.flash('rc');
        locals.message = req.flash('msg');
        locals.old = req.flash('body');
        locals.validation = req.flash('validation');
        locals.fields = fields = [
                { "title": "Nombre", "type": "text", "name": "name", "maxlength": 60, "msg": "name", "placeholder": "" },
                { "title": "Apellido", "type": "text", "name": "surname", "maxlength": 60, "msg": "surname", "placeholder": "" },
                { "title": "Email", "type": "text", "name": "email", "maxlength": 100, "msg": "email", "placeholder": "" },
                { "title": "Telefono", "type": "text", "name": "phone", "maxlength": 13, "msg": "phone", "placeholder": "" },
                { "title": "Direcci&oacute;n", "type": "h5", "name": null, "maxlength": null, "msg": null, "placeholder": null },
                { "title": "Calle", "type": "text", "name": "street", "maxlength": 60 , "msg": "street", "placeholder": ""},
                { "title": "Ciudad", "type": "text", "name": "city", "maxlength": 60, "msg": "city", "placeholder": "" },
                { "title": "Estado", "type": "text", "name": "state", "maxlength": 60, "msg": "state", "placeholder": "" },
                { "title": "Zip", "type": "text", "name": "zip_code", "maxlength": 10, "msg": "zip_code", "placeholder": "" },
                { "title": "Tipo de carro", "type": "text", "name": "car_type", "maxlength": 60, "msg": "car_type", "placeholder": "" },
                { "title": "A&ntilde;o del carro", "type": "text", "name": "year_car", "maxlength": 4, "msg": "year_car", "placeholder": "" },
                { "title": "Tarjeta de cr&eacute;dito/d&eacute;bito", "type": "h5", "name": null, "maxlength": null, "msg": "credid_card", "placeholder": null },
                { "title": "N&uacute;mero", "type": "text", "name": "number", "maxlength": 16, "msg": "number", "placeholder": "16 dígitos" },
                { "title": "Fecha de expiraci&oacute;n", "type": "text", "name": "exp_date", "maxlength": 7, "msg": "exp_date", "placeholder": "MM/YYYY" },
                { "title": "CVV", "type": "text", "name": "cvv", "maxlength": 4, "msg": "cvv", "placeholder": "" }
        ];

        res.render('pages/index');

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