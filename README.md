# NODE STREAMS

## Details

Building Node streams that take in line separated text and converts to objects. Streams provides size of data (bytes), time elapsed (milliseconds), total lines, rate of input stream, and growth rate of the file.

### Clone/Download the repository and follow the steps to run streams

1. Run `tail -f sample.txt | node index.js` to begin streams.
2. While Node is running, edit the tail end of the **sample.txt** file.
3. Terminal will stream live the new input being saved into the .txt file. 
4. Information provided when new data is received is rate of input stream, total lines, and growth rate.
