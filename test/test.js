const { lineSplit, arrayToObj, objToString } = require('../index')
const expect = require('chai').expect

describe('Streams', function () {
  describe('Stream types', function () {
    it('should be a readable stream', function () {
      expect(lineSplit._readableState.objectMode).to.true
    })

    it('should be a duplux ', function () {
      expect(arrayToObj._readableState.objectMode && arrayToObj._writableState.objectMode).to.true
    })

    it('should return 0 given 0', function () {
      expect(objToString._writableState.objectMode).to.true
    })
  })
})