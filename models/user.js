const db = require('../bin/conn');
const PropertiesReader = require('properties-reader');
const Client = require('node-rest-client').Client;

var client = new Client();

var properties = PropertiesReader('.env');

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

        var route = properties.get('api.base')+"/user";
        
        var args = {

            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json"
            },
            data: data
        };

        client.post(route, args, function (data, response) {

            fulfill({ data: data, status: response.statusCode });

        });
    });
};