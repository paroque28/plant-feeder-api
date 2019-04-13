const path = require('path')

module.exports = {
  parser: 'babel-eslint',
  extends: ['react-app', 'airbnb',],
  rules: {
    'react/prop-types': 0,
    'template-curly-spacing': 0,
    indent: 0,
    semi: ['error', 'never'],
    'no-alert': 0,
    'import/prefer-default-export': 0,
    'react/destructuring-assignment': [2, 'always', { ignoreClassFields: true }],
    'react/jsx-filename-extension': 0,
    'global-require': 0,
    'no-useless-escape': 0,
    'template-curly-spacing': 0,
    indent: 0,
    'no-restricted-syntax': ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  }
}
