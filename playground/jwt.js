/**
 * Created by yaniv on 6/2/17.
 */
const jwt = require('jsonwebtoken');

var data = {
    id : 12,
};

//123abc is the salt - our secret
var token = jwt.sign(data, '123abc');
console.log(token);
// jwt.verify

try {
    var decoded = jwt.verify(token, '123abc');
    console.log('Decoded: ', decoded);
} catch(e) {
    console.log(e);
}
