/**
 * Created by yaniv on 6/2/17.
 */
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) =>{
//  bcrypt.hash(password, salt, (err, hash) => {
//      console.log(hash);
//  });
// });

var hashedPassword = '$2a$10$YAgJbHwae8UqohOSlH1yM.8DBxqWkkqGLINsSFrzjbyegJxqGxpMa';

bcrypt.compare(password, hashedPassword, (err, res) => {
   console.log(res);
});