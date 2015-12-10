module.exports = function(wallaby){
  return {
    files: ['index.js', 'lib/*'],
    tests: ['test/index.js'],
    env: { type: 'node', runner: 'node' },
    testFramework: 'mocha@2.1.0',
    debug: true
  }
}