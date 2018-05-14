var express = require('express');
var router = express.Router();

var model = require('../models/user');

router.post('/user', function(req, res) {

    model.store(req.body, function (err, obj) {

        if (err) {

            res.send({
                rc: -2,
                msg: 'something was bad',
                detail: {
                    code: (typeof err.code != 'undefined') ? err.code : null,
                    errno: (typeof err.errno != 'undefined') ? err.errno : null,
                    sqlMessage: (typeof err.sqlMessage != 'undefined') ? err.sqlMessage : null
                }
            });

        } else {
            
            res.status(200).send({
                rc: 0,
                msg: 'process_ok',
                detail: obj.toJSON()
            });

        }

    })
});

module.exports = router;