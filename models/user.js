const db = require('../bin/conn');

const Client = require('node-rest-client').Client;

var client = new Client();

var User = db.conn().Model.extend({
    tableName: 'vy_users'
});

exports.list = function(callback) {
    new User().fetchAll().then(function(user) {
        callback(null, user)
    }).catch(function(err) {
        callback(err, null)
    });
};

exports.store = function(req, callback) {
    new User(req).save().then(function(user) {
        callback(null, user)
    }).catch(function(err) {
        callback(err, null)
    });
};

exports.api = function(data, callback) {
    return new Promise(function (fulfill, reject){
        var route = base+"/store";
        var args = {
            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json"
            },
            data: data
        };
        console.log(route);
        client.post(route, args, function (data, response) {
            fulfill({ data: data, status: response.statusCode });
        });
    });
};