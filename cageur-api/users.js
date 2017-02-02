// var users = [{  
//     id: 1,
//     name: "indra.gunawan",
//     email: "indra.gunawan@gmail.com",
//     password: "123456"
// }, {
//     id: 2,
//     name: "Jamie Christian",
//     email: "j.cullum@gmail.com",
//     password: "123456"
// }];

// console.log(users)
// module.exports = users;  

const users = require('./app/api/users/login.js');
const hasil = users.getAllUser().then(data => console.log(data))

module.exports = hasil;  