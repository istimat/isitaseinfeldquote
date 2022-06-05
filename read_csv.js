const fs = require('fs');

const allFileContents = fs.readFileSync('scripts.csv', 'utf-8');
allFileContents.split(/\r?\n/).forEach(line =>  {
  
    
  
    console.log(`Line from file: ${line}`);
});