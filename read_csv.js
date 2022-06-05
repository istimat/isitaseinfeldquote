const fs = require('fs');

const allFileContents = fs.readFileSync('scripts.csv', 'utf-8');
allFileContents.split(/\r?\n/).forEach(line =>  {
    const splitLine = line.split(",")
    const season = splitLine[0]
    const episode = splitLine[1]
    const actor = splitLine[2]
    const dialogue = splitLine[3]
    
    console.log(`Line from file: ${dialogue}`);
});