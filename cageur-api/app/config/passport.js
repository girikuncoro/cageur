const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { jwtSecret, jwtSession } = require('../config');

module.exports = (passport) => {
  const params = {
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
  };
};

var passport = require("passport");
var passportJWT = require("passport-jwt");
// var users = require("./users.js");


const login = require('./app/api/users/login.js');
const users = login.getAllUser()


var cfg = require("./config.js");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function() {
    var strategy = new Strategy(params, function(payload, done) {
        users.then(data => {
            let found = data.find(user => user.id == payload.id);

            if (!found) {
                return done(new Error("User not found"), null);
            }

            return done(null, {
                id: found.id
            });
        })
    });
    passport.use(strategy);
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            console.log(passport.authenticate("jwt", cfg.jwtSession))
            // return passport.authenticate("jwt", cfg.jwtSession);
            return passport.authenticate("jwt", { session : false } );
        }
    };
};
