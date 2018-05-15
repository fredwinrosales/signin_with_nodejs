var express = require('express');
const PropertiesReader = require('properties-reader');
var braintree = require("braintree");
var router = express.Router();

var properties = PropertiesReader('.env');

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: properties.get('braintree.merchantId'),
    publicKey: properties.get('braintree.publicKey'),
    privateKey: properties.get('braintree.privateKey')
});

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var model = require('../models/user');
var is_required = "es obligatorio";
var is_mail = "debe ser un correo eletrónico";
var in_use = "ya se encuentra registrado";

router.post('/user', [
    check('name')
      .isLength({ min: 1 })
      .withMessage(is_required),
      check('surname')
        .isLength({ min: 1 })
        .withMessage(is_required),
    check('email')
      .isEmail().withMessage(is_mail)
      .trim()
      .normalizeEmail()
      .custom(value => {
        return new Promise((resolve, reject) => {
            model.findUserByEmail(value, (err, user) => {
                if (err) throw err;
                if(user == null) {
                    resolve();
                } else {
                    reject(in_use);
                }
            });
        });
      }),
      check('phone')
        .isLength({ min: 1 })
        .withMessage(is_required),
      check('street')
        .isLength({ min: 1 })
        .withMessage(is_required),
      check('city')
        .isLength({ min: 1 })
        .withMessage(is_required),
      check('state')
        .isLength({ min: 1 })
        .withMessage(is_required),
      check('zip_code')
        .isLength({ min: 1 })
        .withMessage(is_required),
      check('car_type')
        .isLength({ min: 1 })
        .withMessage(is_required),
      check('year_car')
        .isLength({ min: 1 })
        .withMessage(is_required),
      check('number')
        .isLength({ min: 1 })
        .withMessage(is_required),
      check('exp_date')
        .isLength({ min: 1 })
        .withMessage(is_required),
      check('cvv')
        .isLength({ min: 1 })
        .withMessage(is_required),
  ], function(req, res) {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).send({
            rc: -1,
            msg: 'Por favor verifique los datos y intentelo nuevamente.',
            validation: errors.mapped(),
            body: req.body
        });
    }

    console.log("Registrando cliente");
    model.braintree_customer(req.body).then(function(obj_customer) {
        console.log(obj_customer);
        console.log("Registrando tarjeta de credito");
        model.braintree_credircard(obj_customer.data.customer.id, req.body).then(function(obj_credircard) {
            console.log(obj_credircard);
            if(obj_credircard.data.message)
            {
                return res.status(422).send({
                    rc: -1,
                    msg: 'Por favor verifique los datos y intentelo nuevamente.',
                    validation: {
                        credid_card: {
                          msg: obj_credircard.data.message
                        }
                    },
                    body: req.body
                });
            }

            model.store({
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                phone: req.body.phone,
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                zip_code: req.body.zip_code,
                car_type: req.body.car_type,
                year_car: req.body.year_car
            }, function (err, obj) {

                if (err) {
        
                    res.status(422).send({
                        rc: -2,
                        msg: 'Imposible continuar, por favor intente mas tarde.',
                        detail: {
                            code: (typeof err.code != 'undefined') ? err.code : null,
                            errno: (typeof err.errno != 'undefined') ? err.errno : null,
                            sqlMessage: (typeof err.sqlMessage != 'undefined') ? err.sqlMessage : null
                        },
                        body: req.body
                    });
        
                } else {
                    
                    res.status(200).send({
                        rc: 1,
                        msg: 'El registro fue realizado de manera exitosa.',
                        detail: obj.toJSON()
                    });
        
                }
            })

        });

    });
});

router.post('/braintree/customer', function(req, res) { 
    gateway.customer.create({
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        company: req.body.company,
        email: req.body.email,
        phone: req.body.phone,
        fax: req.body.fax,
        website: req.body.website
    }, function (err, result) {
        res.send(result);
    });
});

router.post('/braintree/creditcard', function(req, res) {
    let creditCardParams = {
        customerId: req.body.customer_id,
        number: req.body.card_number,
        expirationDate: req.body.exp_date,
        cvv: req.body.cvv
    };

    gateway.creditCard.create(creditCardParams, function (err, response) {
        res.send(response);
    });
});

module.exports = router;