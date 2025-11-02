# Blog Application ✍️

A modern full-stack blog application built with React (Vite) and Express, powered by Supabase PostgreSQL. Supports posts with images, categories, comments, likes, and admin dashboard.

## 🌟 Features

**Core Functionality**: Post management, categories, likes, comments, search  
**Content System**: Image uploads, pagination, category filtering  
**Admin Dashboard**: Post & category management, notifications  
**User Experience**: Responsive UI, social sharing, real-time updates

## 🛠️ Tech Stack

**Frontend**: React 19, Vite, Tailwind CSS, React Router, shadcn/ui, Lucide React  
**Backend**: Express 5, Supabase (PostgreSQL), Vercel  
**Authentication**: Custom AuthContext with localStorage

## 📁 Project Structure

```
test-app/
├── client/          # React frontend
│   ├── src/
│   │   ├── pages/   # Page components
│   │   ├── components/  # UI components
│   │   ├── context/     # React Context
│   │   └── assets/      # Static assets
├── server/          # Express backend
│   ├── app.mjs      # Main server file
│   └── vercel.json  # Deployment config
└── package.json     # Root workspace
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables in `server/.env`:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Development

Start the frontend:
```bash
npm run dev  # Runs on http://localhost:5173
```

Start the backend:
```bash
cd server
npm start  # Runs on http://localhost:4001
```

## 📜 Available Scripts

- `npm run dev` - Start frontend dev server
- `npm run build` - Build frontend for production
- `npm run install:all` - Install all dependencies
- `npm start` (in server/) - Start backend server

## 🌐 API Endpoints

- `GET /posts` - Get all posts with pagination, filtering, and search
- `GET /posts/:postId` - Get single post by ID
- `PUT /posts/:postId` - Update post
- `DELETE /posts/:postId` - Delete post

### Query Parameters
- `page` - Page number for pagination
- `limit` - Posts per page (default: 6)
- `category` - Filter by category name
- `keyword` - Search keyword

## 🎨 Pages

**Public**: Landing, Post Detail, Sign Up/Sign In, Profile  
**Admin**: Article Management, Category Management, Notifications, Create/Edit Content