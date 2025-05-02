// This is a helper script to update all tool routes to use their unique IDs
import fs from 'fs';
import path from 'path';

// Path to the home.tsx file
const homeFilePath = './client/src/pages/home.tsx';

// Read the file content
let content = fs.readFileSync(homeFilePath, 'utf8');

// Regular expression to find tool entries
const toolRegex = /id: '([^']+)',[^}]*href: '\/([^/]+)' \/\/ Using existing [^}]+ converter page/g;

// Replace all occurrences
let match;
let replacementCount = 0;

// Since regex.exec() behaves differently with /g flag, we need to keep track of where we left off
let lastIndex = 0;
content.replace(toolRegex, (match, toolId, pageType, offset) => {
  // Create the replacement
  const oldString = `href: '/${pageType}' // Using existing`;
  const newString = `href: '/${pageType}/${toolId}' // Updated with unique`;
  
  // Replace just this occurrence
  content = content.slice(0, content.indexOf(oldString, lastIndex)) 
           + newString 
           + content.slice(content.indexOf(oldString, lastIndex) + oldString.length);
  
  // Update the last index to continue after this match
  lastIndex = offset + match.length;
  
  replacementCount++;
  return match; // This doesn't actually replace anything
});

// Write the updated content back to the file
fs.writeFileSync(homeFilePath, content);

console.log(`Updated ${replacementCount} tool routes with unique IDs.`);