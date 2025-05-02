#!/usr/bin/env node

/**
 * This script sets up a basic client directory structure for local development
 * This is particularly useful if you're only working on the backend initially
 */

const fs = require('fs');
const path = require('path');

// Create client directory if it doesn't exist
if (!fs.existsSync('client')) {
  console.log('Creating client directory...');
  fs.mkdirSync('client');
}

// Create client/src directory if it doesn't exist
if (!fs.existsSync('client/src')) {
  console.log('Creating client/src directory...');
  fs.mkdirSync('client/src');
}

// Create index.html if it doesn't exist
if (!fs.existsSync('client/index.html')) {
  console.log('Creating client/index.html...');
  fs.writeFileSync('client/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MultiConvert AI - Intelligent Conversion Tools</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`);
}

// Create main.tsx if it doesn't exist
if (!fs.existsSync('client/src/main.tsx')) {
  console.log('Creating client/src/main.tsx...');
  fs.writeFileSync('client/src/main.tsx', `import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      'div',
      { style: {padding: '2rem', textAlign: 'center'} },
      [
        React.createElement('h1', null, 'MultiConvert AI'),
        React.createElement('p', null, 'Your intelligent conversion toolkit'),
        React.createElement('p', null, 'Backend API endpoints ready for use!'),
        React.createElement(
          'div',
          { style: {marginTop: '2rem'} },
          React.createElement(
            'a',
            { href: '/health', style: {color: 'blue', textDecoration: 'underline'} },
            'Check API Health'
          )
        )
      ]
    )
  )
);`);
}

// Create App.tsx if it doesn't exist
if (!fs.existsSync('client/src/App.tsx')) {
  console.log('Creating client/src/App.tsx...');
  fs.writeFileSync('client/src/App.tsx', `import React from 'react';

export default function App() {
  return (
    <div style={{padding: '2rem', textAlign: 'center'}}>
      <h1>MultiConvert AI</h1>
      <p>Your intelligent conversion toolkit</p>
      <p>Ready to build amazing conversion tools!</p>
    </div>
  );
}`);
}

console.log('Client directory structure set up successfully!');
console.log('You can now run the application with `npm run dev`');