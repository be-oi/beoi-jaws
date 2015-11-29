var Promise  = require('bluebird'),
    AWS      = require('aws-sdk'),
    moment   = require('moment'),
    debug    = require('debug')('registration');

var dynamodb = new AWS.DynamoDB();
Promise.promisifyAll(Object.getPrototypeOf(dynamodb));

var validateInput = function(data) {
  return new Promise(function(resolve, reject) {
    resolve(data);
  });
}

var createUser = function(data) {
  return new Promise(function(resolve, reject) {
    var user = {
      email:    data.email,
      created:  moment().unix().toString(),
    }
    resolve(user);
  });
}

var storeUser = function(user) {
  debug('Saving ' + JSON.stringify(user));
  return dynamodb.putItemAsync({
    TableName: "beoi-contestants",
    Item: {
      email:    { S: user.email },
      created:  { S: user.created },
    }
  });
}

var action = function(event) {
  return validateInput(event)
    .then(createUser)
    .then(storeUser);
};

// Export For Lambda Handler
module.exports.run = function(event, context, cb) {
  console.log(action);
  return action(event)
    .then(function(result) {
      cb(null, result);
    })
    .error(function(error) {
      cb(error, null);
    });
};