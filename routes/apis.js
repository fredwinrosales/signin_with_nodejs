var express = require('express');
var router = express.Router();

var model = require('../models/user');

router.get('/', function(req, res) {
    model.list(function (err, content) {
        if (err) {
            console.log(err);
        } else {
            res.send(content.toJSON());
        }
    })
});

router.post('/store', function(req, res) {
    model.store(req.body, function (err, content) {
        if (err) {
            console.log(err);
        } else {
            res.send(content.toJSON());
        }
    })
});

module.exports = router;