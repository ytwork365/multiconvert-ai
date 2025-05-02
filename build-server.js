// Script to build the server-side code for production
import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

console.log('Building server code for production...');

try {
  // Build the server.js file
  build({
    entryPoints: ['server.js'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    outfile: 'dist/server.js',
    format: 'esm',
    external: [
      'express',
      'express-session',
      'dotenv',
      'path',
      'fs',
      'url',
      'zod',
    ],
    minify: true,
  }).then(() => {
    console.log('Server code built successfully!');
    
    // Copy .env.production to dist
    fs.copyFileSync('.env.production', 'dist/.env.production');
    console.log('Environment configuration copied.');
    
    // Create a simple startup script
    const startupScript = `#!/bin/bash
# Startup script for Hostinger
NODE_ENV=production node server.js
`;
    
    fs.writeFileSync('dist/start.sh', startupScript);
    fs.chmodSync('dist/start.sh', '755'); // Make executable
    console.log('Startup script created.');
    
    // Copy production package.json to dist
    fs.copyFileSync('package.production.json', 'dist/package.json');
    console.log('Production package.json copied.');
    
    console.log('Build completed successfully! The "dist" directory is ready for deployment.');
  });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}