
const fs = require('fs');
const Baby = require('babyparse');

// pass in the contents of a csv file
parsed = Baby.parseFiles('data/meteorites.csv', { header: true });

console.log(parsed);
// voila
// rows = parsed.data;


fs.writeFile('data/meteorites.json', JSON.stringify(parsed.data));
