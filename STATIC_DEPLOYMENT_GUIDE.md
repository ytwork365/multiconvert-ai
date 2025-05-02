# Static Deployment Guide for MultiConvert AI

This guide explains how to deploy MultiConvert AI as a static website on standard web hosting.

## Building for Production

1. Download the project code from Replit
2. Open a terminal/command prompt in the project folder
3. Run the following commands:
   ```bash
   npm install
   npx vite build --config vite.static.config.js
   ```
4. After the build completes, you'll have a `static-build` folder with all the files needed for deployment

## Deploying to Hostinger

1. **Log in to Hostinger hPanel**
2. **Navigate to File Manager**:
   - Go to "Advanced" > "File Manager"
   - Go to your `public_html` directory

3. **Upload Files**:
   - Upload all the files from the `static-build` folder to your `public_html` directory
   - Make sure to include the `.htaccess` file (it might be hidden in some file managers)

4. **Verify File Permissions**:
   - HTML, CSS, JS files should have 644 permissions
   - Directories should have 755 permissions
   - To change permissions in File Manager, right-click on a file/folder and select "Change Permissions"

## Important Notes

1. **This is a static deployment without server features**:
   - The social media downloaders are in demo mode and won't fetch real data
   - History saving is simulated in browser memory
   - Any feature requiring a server-side API won't work with real data

2. **Client-side Routing**:
   - The `.htaccess` file is essential for the website to work correctly
   - It ensures all routes redirect to index.html for client-side routing

3. **SEO and Performance**:
   - All SEO optimizations are preserved in the static build
   - Make sure to set up your site in Google Search Console
   - Consider adding a sitemap.xml file to your root directory

## Troubleshooting

1. **Blank Pages or 404 Errors**:
   - Check that the `.htaccess` file was uploaded correctly
   - Make sure mod_rewrite is enabled on your hosting

2. **Images Not Loading**:
   - Verify that all files in the `assets` folder were uploaded
   - Check file permissions

3. **If a Page Shows a Network Error**:
   - This is likely because the page is trying to access a server-side API
   - These features are in demo mode in the static build

## For Full Functionality

If you need all features to work with real data:
1. Upgrade to a Hostinger Business plan with Node.js support
2. Follow the instructions in the main `DEPLOYMENT_GUIDE.md` file