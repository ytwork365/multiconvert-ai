# Deployment Guide for MultiConvert AI Website on Hostinger

This guide will help you deploy your MultiConvert AI website on Hostinger hosting.

## Prerequisites

1. A Hostinger hosting account with:
   - Node.js support (Hostinger Business or Premium plans include Node.js)
   - MySQL database (optional - if you want to switch from in-memory storage to persistent storage)

## Deployment Steps

### Step 1: Download your project files

First, you need to download all your project files from Replit. You can do this by:
1. Click on the three dots icon in the Files panel
2. Select "Download as zip"
3. This will download your entire project as a ZIP file

### Step 2: Prepare your project for Hostinger

Before uploading to Hostinger, you need to build your project for production:

1. Extract the ZIP file to your local computer
2. Open a terminal/command prompt in your project directory
3. Make sure you have Node.js installed (version 18 or higher)
4. Run the following commands to build your project:

```bash
# Install dependencies
npm install

# Build frontend and backend
npm run build
```

5. After building, you should have a `dist` directory containing:
   - `dist/client/` - Your compiled frontend code
   - `dist/server.js` - Your optimized backend server
   - `dist/package.json` - Production dependencies
   - `dist/.env.production` - Environment configuration
   - `dist/start.sh` - Startup script

### Step 3: Upload your files to Hostinger

1. Log in to your Hostinger control panel (hPanel)
2. Navigate to "Advanced" > "File Manager" or use FTP (FileZilla, etc.) to connect to your hosting
3. Go to the "public_html" directory (or create a subdirectory if you want to use a subdomain)
4. Upload the contents of your `dist` directory to this location

### Step 4: Set up Node.js on Hostinger

1. Log in to your Hostinger hPanel
2. Navigate to "Website" > "Node.js"
3. Click on "Create a New Node.js Application"
4. Configure the following:
   - Select the domain name where you want to host the application
   - Set the Application URL path to `/` for root or a custom path if needed
   - Set the Application root to the directory where you uploaded your files (e.g., `/public_html/`)
   - Set the Application startup file to `server.js`
   - Set Node.js version to 18.x or later
   - Add the following environment variables:
     - `NODE_ENV`: `production`
     - `PORT`: `8080` (or as provided by Hostinger)
     - `SESSION_SECRET`: a random secure string
     - Any API keys you have for social media services
5. Click "Create" to set up your Node.js application

### Step 5: Install dependencies on the server

1. Connect to your server using SSH:
   - Go to hPanel > "Advanced" > "SSH Access"
   - If SSH is not enabled, click on "Enable SSH Access"
   - Use the provided SSH details to connect via your terminal or an SSH client like PuTTY

2. Navigate to your application directory:
   ```bash
   cd public_html   # or your custom directory
   ```

3. Install production dependencies:
   ```bash
   npm install --omit=dev
   ```

### Step 6: Start your application

The Node.js application should start automatically after setup. If you need to restart it:

1. Go to Hostinger hPanel > "Website" > "Node.js"
2. Find your application in the list
3. Click the "Restart" button

If the application doesn't start automatically:

1. Connect via SSH again
2. Navigate to your application directory
3. Run:
   ```bash
   node server.js
   ```
   
4. If you get a "command not found" error for node, you might need to use the full path:
   ```bash
   /opt/alt/alt-nodejs18/root/usr/bin/node server.js
   ```

### Alternative approach for static frontend-only deployment

If your Hostinger plan doesn't include Node.js support or you prefer to deploy just the frontend as a static website:

1. Build just the frontend part of your application locally:

```bash
# Create a production build of just the frontend
npx vite build --outDir dist/static

# Create a simple server.php file to handle client-side routing
echo '<?php
// Handle client-side routing by redirecting all requests to index.html
$uri = $_SERVER["REQUEST_URI"];
if (!file_exists(__DIR__ . $uri) || is_dir(__DIR__ . $uri)) {
    include __DIR__ . "/index.html";
    exit;
}
?>' > dist/static/.htaccess
```

2. Upload the contents of the `dist/static` directory to your Hostinger hosting:
   - Log in to Hostinger hPanel
   - Navigate to "Advanced" > "File Manager"
   - Go to the `public_html` directory
   - Upload all the files from your local `dist/static` directory

3. Configure server for client-side routing:
   - Ensure the `.htaccess` file is properly uploaded
   - If your site shows 404 errors when navigating directly to routes, check if:
     - `.htaccess` is properly configured
     - "URL Rewrite" option is enabled in your Hostinger hPanel

4. If you need backend functionality:
   - Deploy the backend separately on a service that supports Node.js
   - Update your frontend API URLs to point to this external backend
   - Example backend hosting options:
     - Render.com
     - Railway.app
     - Fly.io
     - Glitch.com

## Troubleshooting

### Common issues and solutions

1. **Application doesn't start**: Check your Node.js configuration and make sure all dependencies are installed.
2. **"Module not found" errors**: Ensure all dependencies are properly installed with `npm install`.
3. **API not working**: Check if your environment variables are correctly set in the Hostinger Node.js configuration panel.
4. **Database connection issues**: If using a database, verify your connection credentials in the .env file.

### Contacting Hostinger Support

If you encounter issues, Hostinger provides 24/7 support:
1. Log in to your Hostinger account
2. Click on the "Help" or "Support" button
3. Open a support ticket describing your issue in detail

## Maintaining your application

### Updates and maintenance

1. Make changes to your code locally
2. Build the updated version
3. Upload the new files to Hostinger
4. Restart your Node.js application if necessary

### Monitoring

Hostinger provides basic monitoring tools for your application. Check the Node.js section of your hPanel to monitor resource usage and application status.

## Security Considerations

1. Always keep your dependencies updated to patch security vulnerabilities
2. Store sensitive information in environment variables, not in code
3. Implement proper error handling to avoid exposing sensitive information
4. Use HTTPS by enabling SSL for your domain through Hostinger

## Scaling

If your application grows and needs more resources:
1. Consider upgrading your Hostinger hosting plan
2. Look into separating your frontend and backend services
3. Implement caching mechanisms to improve performance