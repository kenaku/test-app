module.exports = {
    "extends": ["airbnb", "plugin:import/errors"],
    "plugins": [
      "react",
      "import",
    ],

    "parserOptions": {
      "ecmaVersion": 6,
      "sourceType": "module",
      "ecmaFeatures": {
        "jsx": true,
        experimentalObjectRestSpread: true,
      },
    },

    "settings": {
      "import/ignore": [
        "node_modules",
        /.(html|mu|mustache)$/,
        /.(css|styl|scss|sass)$/,
        /.(svg|png|jpg|gif|webp)$/,
      ]
    },

    "rules": {
      "no-new": 0,
      "arrow-body-style": [0, "as-needed"],
      "object-curly-spacing": [2, "never"],
      "no-param-reassign": [2, {"props": false}],
      "space-before-function-paren": 2,
      // rules
      // partially copied from onlineeducation
      "func-names": 0,
      "semi": [2, "never"],
      "global-require": 0,
      "no-multiple-empty-lines": [2, {"max": 3}], // allows up to 3 empty lines
      "padded-blocks": 0,
      "guard-for-in": 0,
      "no-reserved-keys": 0, // it's okay in ES5+ enviroment, which is well, everywhere...
      "react/wrap-multilines": 0,
      "semi-spacing": 0,
      "quotes": [1, "single"], // i dont' set this up as an error since sometimes you just need to use diferent types of quites
      "no-trailing-spaces": [2],
      "no-unused-vars": [2, {"vars": "all", "args": "none"}], // allows full function sinature yet disallows unused vars in blocks
      "no-var": 2, // no var use, is well okay
      "id-length": 0, // fuck it, we need to use (e) => and other stuff with 1 char name variables
      // nice thing to have:
      //
      // up to everyone: {foo, bar,} or {foo, bar} - both are valid (for multiline obviously)
      "comma-dangle": [0],
      // it should not be error since it can not be used consistently
      // see https://github.com/eslint/eslint/issues/3223 - they have good point
      // it is a good thing to seprate destructuring into let/const blocks yet it's ugly
      // and costly since we creating new objects :(
      // i guess we have to wait untill destructuring assignment will be added to exeptions
      "prefer-const": 1,
      "react/jsx-no-bind": [2, {
        "ignoreRefs": true,
        "allowArrowFunctions": true,
        "allowBind": true
      }],
      "react/prefer-es6-class": [2, "never"],
      "import/no-unresolved": [2, {commonjs: true, amd: true}],
      "import/named": 2,
      "import/namespace": 2,
      "import/default": 2,
      "import/export": 2,
    },

    "env": {
      "browser": true,
      "node": true,
      "es6": true,
      "jasmine": true
    },

    "globals": {
      "__DEV__": true,
      "__PRERENDER__": true,
      "__BASE_URL__": true,
      "__API_BASE__": true,
      "__FB_ADMINS__": true,
      "__FB_APP_ID__": true,
      "__VK_APP_ID__": true,
      "__GA__": true,
      "__UC_PUB_KEY__": true,
      "__GOOGLE_VERIFICATION__": true,
      "__YANDEX_VERIFICATION__": true,
      "__DEV_PRERENDER__": true,
      "__USE_HOT_PRERENDER__": true,
      "null": true,
      "sinon": true
    }
}