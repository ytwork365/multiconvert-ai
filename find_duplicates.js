const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join('client', 'src', 'pages', 'home.tsx'), 'utf8');
// Match both id patterns - in tool definitions and category definitions
const idRegex = /id:\s*['"]([^'"]+)['"]/g;
let match;
const ids = [];
const lineMap = {};

// Find all IDs and their line numbers
const lines = content.split('\n');
lines.forEach((line, i) => {
  const lineNumber = i + 1;
  const matches = line.matchAll(/id:\s*['"]([^'"]+)['"]/g);
  for (const match of matches) {
    const id = match[1];
    ids.push(id);
    if (!lineMap[id]) {
      lineMap[id] = [];
    }
    lineMap[id].push(lineNumber);
  }
});

// Find duplicates
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
const uniqueDuplicates = [...new Set(duplicates)];

console.log('Total tool IDs found:', ids.length);
console.log('Unique tool IDs:', new Set(ids).size);
console.log('Found', uniqueDuplicates.length, 'duplicate IDs:', uniqueDuplicates);

// Show occurrence counts for duplicates with line numbers
if (uniqueDuplicates.length > 0) {
  console.log('\nOccurrences of duplicate IDs:');
  uniqueDuplicates.forEach(id => {
    const count = ids.filter(i => i === id).length;
    console.log(`- '${id}': ${count} occurrences at lines ${lineMap[id].join(', ')}`);
  });
}
