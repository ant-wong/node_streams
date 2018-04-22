const { Transform } = require('stream')
const fs = require('fs')
// const fileName = process.argv[2]

var offset = 0

const lineSplit = new Transform({
  readableObjectMode: true,

  transform(chunk, encoding, callback) {
    console.log(chunk.toString())
    this.push(chunk.toString().trim().split('\n\n'))
    callback()
  }
})

process.stdin.on('readable', () => {
  let buf = process.stdin.read()
  if (!buf) return
  for (; offset < buf.length; offset++) {
    if (buf[offset] === 0x0a) {
      console.dir(buf.slice(0, offset).toString())
      buf = buf.slice(offset + 1)
      offset = 0
      process.stdin.pipe(buf)
      return
    }
  }
  process.stdin.pipe(buf)
})
  .pipe(lineSplit)