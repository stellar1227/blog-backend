const path = require('path');

module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "settings" : {
        "import/resolver" : {
            node : {
                paths : [path.resolve('./src')]
            }
        },
    },
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "no-unused-vars" : 1,
        "comma-dangle" : 0,
        "eol-last" : 0,
        "no-console" : 0
    }
};