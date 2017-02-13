const passport = require('passport');

const passportJWT = require('passport-jwt');

const login = require('./app/api/users/login');

const users = login.getAllUser();

const cfg = require('./config'); 

const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = { secretOrKey: cfg.jwtSecret, jwtFromRequest: ExtractJwt.fromAuthHeader() };

module.exports = function() {
    const strategy = new Strategy(params, function(payload, done) {
        users.then(data => {
            const found = data.find(user => user.id === payload.id);
            if (!found) { return done(new Error('User not found'), null); }
            return done('null', { id: found.id });
        })
    });
    passport.use(strategy);
    return {
        initialize: function() { return passport.initialize(); },
        authenticate: function() { return passport.authenticate('jwt', {session: false} ); }
    };
};

