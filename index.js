const { Transform } = require('stream')
// const fileName = process.argv[2]

// START TIME (MS)
const hrstart = process.hrtime()

// READ STREAM AND TRANSFORM BUFFER
// PIPE TO NEXT STREAM

const lineSplit = new Transform({
  readableObjectMode: true,

  transform(chunk, encoding, callback) {
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
    this.push(tempArr)
    callback()
  }
})

// CONVERT THE OBJECTS (PLACED IN A TEMP ARRAY) INTO A READABLE STRING
// PUSH THE RATE OF INPUT STREAM (BYTES/SECOND)

const objToString = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {

    let hrend = process.hrtime(hrstart)
    let byteSize = 0
    let totalLines = 0
    let seconds = ((chunk[chunk.length - 1].time) * 0.001)

    for (let i = 0; i < chunk.length; i++) {
      byteSize = byteSize += chunk[i].size
      totalLines = totalLines += chunk[i].lines
      console.log(chunk[i].lines)
      this.push(`\nDATA: ${chunk[i].data}. \nFILE SIZE: ${chunk[i].size} bytes. \nTIME ELAPSED: ${chunk[i].time} milliseconds. \nLINES OF DATA: ${chunk[i].lines}. \n`)
    }
  
    this.push(`The rate of the input stream is: ${(byteSize / seconds).toFixed(4)} bytes/second \nTotal number of lines: ${totalLines} \nGrowth rate: ${(totalLines / seconds).toFixed(4)} lines/second.`)
    callback()
  }
})

// READS THE FILE INPUTTED INTO THE CLI
// PIPES IT INTO THE STREAMS 

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
  .pipe(objToString)
  .pipe(process.stdout)

module.exports = {
  lineSplit: lineSplit,
  arrayToObj: arrayToObj,
  objToString: objToString,
}