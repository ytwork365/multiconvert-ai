#!/usr/bin/env node

/**
 * Script to create a simplified vite.config.js file for Render deployment
 * This helps avoid issues with the entry module not being found
 */

const fs = require('fs');
const path = require('path');

const configContent = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  publicDir: path.resolve(__dirname, "client", "public"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      // Make sure Rollup doesn't error on missing files
      onwarn(warning, warn) {
        // Suppress certain warnings
        if (warning.code === 'MISSING_EXPORT' || 
warning.code === 'MODULE_LEVEL_DIRECTIVE' ||
warning.code === 'CIRCULAR_DEPENDENCY') {
          return;
        }
        warn(warning);
      }
    }
  },
});
`;

// Write the simplified config file
fs.writeFileSync(
  path.join(__dirname, 'vite.render.config.js'), 
  configContent, 
  'utf8'
);

console.log('Created simplified Vite config for Render deployment');
