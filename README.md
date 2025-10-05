# Blog Client Application

A modern blog application built with React frontend.

## Project Structure

```
blog-client-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Static assets
│   ├── package.json
│   └── vite.config.js
├── package.json           # Root package.json with workspaces
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```

### Development

Start the client in development mode:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start the client in development mode
- `npm run build` - Build the client for production
- `npm run install:all` - Install dependencies for all packages

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios

## Development Notes

- The client runs on port 5173 by default
- Uses external API for blog data