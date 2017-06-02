/**
 * Created by yaniv on 6/2/17.
 */

//JWT Explanation!

const {SHA256} = require('crypto-js');


var message = 'I am user number 3';
var hash = SHA256(message).toString();

console.log(`Message : ${message}`);
console.log(`Hash : ${hash}`);

var data = {
    id : 4
};

// Salting a hash -
// adding a unique property to the hash for verification

// Attack Example:
// change id to 5, rehash and send. Without salting, this will look OK

// E.G: adding a unique string to the password everytime before hashing should to the trick,
//      as I am the only one who knows the unique value added!
var token = {
    data,
    hash : SHA256(JSON.stringify(data) + 'somesecret').toString()
};


//MITM attacnk - This attack will not work because of salting!
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();


//Validation
var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
if (resultHash === token.hash) {
    console.log('Data was not changed. trust..');
} else {
    console.log('Data was changed. Dont trust..');
}