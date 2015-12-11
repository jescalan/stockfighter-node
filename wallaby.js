var pkg = require('./package.json')
var babel = require('babel-core')

module.exports = function (wallaby) {
  var config = pkg.babel
  config.babel = babel

  return {
    files: ['index.js', 'lib/*', 'package.json', 'test/config.js', 'test/support/helpers.js'],
    tests: ['test/index.js'],
    env: { type: 'node', runner: 'node' },
    testFramework: 'mocha@2.1.0',
    // debug: true,
    compilers: {
      '**/*.js': wallaby.compilers.babel(config)
    },
    bootstrap: function (w) {
      require('./test/support/helpers')
      w.testFramework.timeout(10000)
      console.log(w.testFramework)
    }
  }
}
