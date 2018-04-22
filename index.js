const { Transform } = require('stream')
const fs = require('fs')
// const fileName = process.argv[2]

// START TIME (MS)
const hrstart = process.hrtime()

// READ STREAM AND TRANSFORM BUFFER
// PIPE TO NEXT STREAM

const lineSplit = new Transform({
  readableObjectMode: true,

  transform(chunk, encoding, callback) {
    console.log(chunk.toString())
    this.push(chunk.toString().trim().split('\n\n'))
    callback()
  }
})

// RECEIVE ARRAY AND CONVERT TO OBJECT
// PROVIDE DATA, SIZE, TIME, AND LINES

const arrayToObj = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    // CONSTRUCTOR
    function Object(data, size, time, lines) {
      this.data = data,
        this.size = size,
        this.time = time,
        this.lines = lines
    }

    let tempArr = []

    for (let i = 0; i < chunk.length; i++) {
      let hrend = process.hrtime(hrstart)
      // DATA FOR EACH OBJECT
      const obj = new Object(
        chunk[i],
        Buffer.byteLength(chunk[i], 'utf8'),
        hrend[1] / 1000000,
        (chunk[i].match(/\n/g)) ? chunk[i].match(/\n/g).length + 1 : 1
      )
      tempArr.push(obj)
    }
    console.log(tempArr)
    this.push(tempArr)
    callback()
  }
})

const objToString = new Transform({
  transform(chunk, encoding, callback) {

  }
})

process.stdin.on('readable', () => {
  let buf = process.stdin.read()
  if (!buf) return
  for (let offset = 0; offset < buf.length; offset++) {
    if (buf[offset] === 0x0a) {
      buf = buf.slice(offset + 1)
      offset = 0
      process.stdin.pipe(buf)
      return
    }
  }
  process.stdin.pipe(buf)
})
  .pipe(lineSplit)
  .pipe(arrayToObj)
  // .pipe(process.stdout)