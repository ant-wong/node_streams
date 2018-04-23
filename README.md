# NODE STREAMS

## Details

Building Node streams that take in line separated text and converts to objects. Streams provides size of data (bytes), time elapsed (milliseconds), total lines, rate of input stream, and growth rate of the file.

### Clone/Download the repository and follow the steps to run streams

**npm install** before running script.

1. Run `tail -f -n +1 sample.txt | node index.js` to begin streams.
2. While Node is running, edit the tail end of the **sample.txt** file.
3. Terminal will stream live the new input while it's being outputed into a **outout.txt** file.
4. Information provided when new data is received is rate of input stream, total lines, and growth rate.

### Run tests
- Run `npm test` to use the Chai.js file. This makes sure that the streams are readable,writable or both. 
