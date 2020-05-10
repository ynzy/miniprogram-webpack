module.exports = {
  "env": {
    "node": true,
    "es6": true
  },
  // "extends": "eslint:recommended",
  "extends": ["plugin:you-dont-need-momentjs/recommended"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 11,
    "sourceType": "module"
  },
  "rules": {
  }
};
