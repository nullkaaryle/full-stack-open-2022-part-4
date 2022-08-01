// Console logging with custom module.
// Use example: logger.info('checking the test variable: ', test-variable)
// Logging is not used when running tests.

const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

module.exports = {
  info, error
}
