module.exports = {
    "extends": "airbnb",
    "installedESLint": true,
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "rules": {
      "new-cap": ["off", { newIsCap: false }],
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-underscore-dangle": ["error", { "allow": ["_id"] }]
    }
};
