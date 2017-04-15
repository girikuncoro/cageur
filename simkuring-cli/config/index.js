const Preferences = require('preferences');

// This module will store configuration in local file
const pref = new Preferences('cageur');

module.exports = pref;