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

exports.findUserByEmail = function(value, callback) {

    new User().where({ email: value }).fetch().then(function(user) {

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
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            data: data
        };

        client.post(route, args, function (data, response) {

            fulfill({ data: data, status: response.statusCode });

        });
    });
};

exports.braintree_customer = function(data, callback) {

    return new Promise(function (fulfill, reject){

        var route = properties.get('api.base')+"/braintree/customer";
        
        var args = {

            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json"
            },
            data: {
                "first_name": data.name,
                "last_name": data.surname,
                "company": null,
                "email": data.email,
                "phone": null,
                "fax": null,
                "website": null
            }
        };

        client.post(route, args, function (data, response) {

            fulfill({ data: data, status: response.statusCode });

        });
    });
};

exports.braintree_credircard = function(customer_id, data, callback) {

    return new Promise(function (fulfill, reject){

        var route = properties.get('api.base')+"/braintree/creditcard";
        
        var args = {

            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json"
            },
            data: {
                "customer_id": customer_id,
                "card_number": data.number,
                "exp_date": data.exp_date,
                "cvv": data.cvv
            }
        };

        client.post(route, args, function (data, response) {

            fulfill({ data: data, status: response.statusCode });

        });
    });
};