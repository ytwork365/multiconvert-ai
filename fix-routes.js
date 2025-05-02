// Fix tool routes by adding unique IDs
import fs from 'fs';

// Read the file
const filePath = './client/src/pages/home.tsx';
const content = fs.readFileSync(filePath, 'utf8');

// Process the file line by line
const lines = content.split('\n');
let updatedLines = [];
let currentToolId = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Capture tool ID when we encounter it
  const idMatch = line.match(/id: ['"]([^'"]+)['"]/);
  if (idMatch) {
    currentToolId = idMatch[1];
  }
  
  // Update href line if it uses a generic route
  if (line.includes('// Using existing') && currentToolId) {
    const routeMatch = line.match(/href: ['"]\/([^'"]+)['"]/);
    if (routeMatch) {
      const baseRoute = routeMatch[1];
      const updatedLine = line.replace(
        `href: '/${baseRoute}' // Using existing`,
        `href: '/${baseRoute}/${currentToolId}' // Updated with unique ID`
      );
      updatedLines.push(updatedLine);
      console.log(`Updated route for tool ${currentToolId}: ${baseRoute}/${currentToolId}`);
    } else {
      updatedLines.push(line);
    }
  } else {
    updatedLines.push(line);
  }
}

// Write back to the file
fs.writeFileSync(filePath, updatedLines.join('\n'));
console.log('All routes have been updated!');
