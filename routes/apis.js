var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var model = require('../models/user');

router.post('/user', [
    check('name')
      .isLength({ min: 1 })
      .withMessage('name is required'),
      check('surname')
        .isLength({ min: 1 })
        .withMessage('surname is required'),
    check('email')
      .isEmail().withMessage('email must be an email')
      .trim()
      .normalizeEmail()
      .custom(value => {
        return new Promise((resolve, reject) => {
            model.findUserByEmail(value, (err, user) => {
                if (err) throw err;
                if(user == null) {
                    resolve();
                } else {
                    reject('this email is already in use');
                }
            });
        });
      }),
      check('phone')
        .isLength({ min: 1 })
        .withMessage('phone is required'),
      check('street')
        .isLength({ min: 1 })
        .withMessage('street is required'),
      check('city')
        .isLength({ min: 1 })
        .withMessage('city is required'),
      check('state')
        .isLength({ min: 1 })
        .withMessage('state is required'),
      check('zip_code')
        .isLength({ min: 1 })
        .withMessage('zip_code is required'),
      check('car_type')
        .isLength({ min: 1 })
        .withMessage('car_type is required'),
      check('year_car')
        .isLength({ min: 1 })
        .withMessage('year_car is required'),
      check('number')
        .isLength({ min: 1 })
        .withMessage('number is required'),
      check('exp_date')
        .isLength({ min: 1 })
        .withMessage('exp_date is required'),
      check('cvv')
        .isLength({ min: 1 })
        .withMessage('cvv is required'),
  ]
, function(req, res) {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).send({
            rc: -1,
            msg: 'validate form failed',
            validation: errors.mapped(),
            body: req.body
        });
    }

    model.store(req.body, function (err, obj) {

        if (err) {

            res.status(422).send({
                rc: -2,
                msg: 'something was bad',
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
                msg: 'process_ok',
                detail: obj.toJSON()
            });

        }

    })
});

module.exports = router;