# MultiConvert AI

A comprehensive multi-tool conversion platform powered by AI, offering 340+ conversion tools across 25+ diverse categories with enhanced SEO optimization and dynamic routing capabilities.

## Features

- Modern, responsive UI with light/dark mode
- 340+ conversion tools organized in 25+ categories
- SEO optimized with proper meta tags and related keywords
- Real-time conversions with instant feedback
- API integrations for social media tools (Instagram, Twitter, YouTube)
- Mobile-first design that works well on all devices

## Project Structure

```
/
├── client/               # Frontend code
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── lib/          # Utility functions and helpers
│   │   ├── pages/        # Page components for each route
│   │   ├── hooks/        # Custom React hooks
│   │   └── App.tsx       # Main application component
│   └── public/           # Static assets
├── server/               # Backend code
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage interface
│   ├── config.ts         # Server configuration
│   └── index.ts          # Express server entry point
├── shared/               # Shared code between frontend and backend
│   └── schema.ts         # Data schemas and types
└── dist/                 # Built application (after running build)
```

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn UI components, wouter for routing
- **Backend**: Node.js, Express
- **State Management**: React Query for server state, React hooks for local state
- **Storage**: In-memory storage (configurable to use a database like MySQL)
- **Build Tools**: Vite, esbuild

## API Integrations

The application includes integrations with:

- Instagram API for downloading photos and videos
- Twitter API for downloading videos
- YouTube API for thumbnail extraction
- OpenAI API for enhanced media processing (optional)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables by copying `.env.example` to `.env` and filling in your API keys

### Development

Run the development server:

```
npm run dev
```

The application will be available at http://localhost:3000

### Building for Production

Build the application:

```
npm run build
```

Start the production server:

```
npm start
```

## SEO Features

- Dynamic meta titles and descriptions for all tools and categories
- Related keywords sections on all pages
- Proper semantic HTML structure
- Structured URLs for better search engine indexing
- Optimized page load times

## Deployment

### Hostinger VPS Deployment

For detailed instructions on deploying to Hostinger VPS, see [HOSTINGER_DEPLOYMENT_GUIDE.md](./HOSTINGER_DEPLOYMENT_GUIDE.md).

1. Clone the repository to your Hostinger VPS
2. Set up environment variables in `.env`
3. Run the build script:
   ```
   ./hostinger-build.sh
   ```
4. Start the application:
   ```
   ./hostinger-start.sh
   ```

For production deployment, we recommend using PM2 as described in the deployment guide.