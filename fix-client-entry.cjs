#!/usr/bin/env node

/**
 * This script ensures the client entry point (index.html) is properly 
 * prepared for the Vite build process on Render.
 */

const fs = require('fs');
const path = require('path');

// Check if client/index.html exists
const indexPath = path.join(__dirname, 'client', 'index.html');
const indexExists = fs.existsSync(indexPath);

if (!indexExists) {
  console.error('ERROR: client/index.html not found!');
  process.exit(1);
}

// Read the file content
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Make sure the script src reference is correct
if (!indexContent.includes('<script type="module" src="/src/main.tsx">')) {
  console.error('WARNING: Script source might be incorrect in index.html');
  // Try to fix it by ensuring the reference is correct
  indexContent = indexContent.replace(
    /<script type="module" src=".*?main\.tsx"><\/script>/,
    '<script type="module" src="/src/main.tsx"></script>'
  );
  
  // Write the modified content back
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log('Fixed script source reference in index.html');
}

// Also ensure we have a title tag for better SEO
if (!indexContent.includes('<title>')) {
  indexContent = indexContent.replace(
    '<head>',
    '<head>\n    <title>MultiConvert AI - Intelligent Conversion Tools</title>'
  );
  
  // Write the modified content back
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log('Added title tag to index.html');
}

// Exit successfully
console.log('Client entry point is ready for build!');
process.exit(0);
