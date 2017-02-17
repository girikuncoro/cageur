/**
* This is a seed to create the first superadmin in DB
*/

const db = require('../config/db');
const User = require('../model/user');

const ADMIN_EMAIL = ''; // fill with unique email
const ADMIN_PASSWORD = ''; // fill with proper password

const user = new User({
  name: 'Super Ultra Admin',
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  role: 'superadmin',
  clinicID: null,
});

if (!user.isValidEmail()) {
  throw new Error('Invalid email format');
}
if (!user.isValidRole()) {
  throw new Error('Invalid role');
}
if (!user.isValidPassword()) {
  throw new Error('Invalid password requirement, must contain at least 1 special character, uppercase, alphabet, number and minimum 8 characters');
}

user.encryptPassword()
.then((_) => {
  return db.any(`
    INSERT INTO cageur_user(role, name, email, password, clinic_id)
    VALUES($(role), $(name), $(email), $(password), $(clinicID))
    RETURNING id, role, name, email, clinic_id, created_at, updated_at`, user
  );
})
.then((data) => {
  console.log('Superadmin seed succeeded', data);
})
.catch(err => console.log('Superadmin seed error', err));
