# Blog Application ✍️

A modern full-stack blog platform built with a React (Vite) frontend and an Express API backed by Supabase PostgreSQL. The app supports dynamic content publishing with images, granular category management, threaded comments, like toggling, and an admin dashboard with notifications.

<div align="center">
  
  <img width="1919" height="1079" alt="Blog application interface" src="https://github.com/user-attachments/assets/627b0316-c9ef-44b0-ae05-c6c6b8cd92f8" />

  
  <em>Landing Page - Home View</em>
</div>

## 🌟 Features

**Core Functionality**: Public feed, single post view, protected profile editing, Supabase-authenticated sessions  
**Content System**: Rich text posts with cover images, pagination, keyword search, category filters  
**Engagement**: Real-time like toggling, inline comments with author avatars, toast feedback  
**Admin Dashboard**: Article and category CRUD, status management (draft/published), notification center  
**User Experience**: Responsive Tailwind UI, shadcn/ui components, toast feedback, loading states

## 🛠️ Tech Stack

**Frontend**: React 19, Vite 7, Tailwind CSS 4, React Router 7, shadcn/ui primitives, Axios, Lucide Icons  
**Backend**: Express 5, Supabase JavaScript SDK, Nodemon, Vercel-friendly deployment  
**Authentication**: Custom AuthContext with Supabase Auth tokens stored in `localStorage`

## 📁 Project Structure

```
Blog-post/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── pages/             # Public & admin page-level routes
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # Authentication provider
│   │   ├── lib/               # Supabase helpers, uploads, utils
│   │   ├── utils/             # Axios JWT interceptor, validators
│   │   └── assets/            # Static media
│   ├── index.html
│   └── vite.config.js
├── server/                    # Express API
│   ├── app.mjs                # App bootstrap & route mounting
│   ├── routes/                # Posts, auth, categories, notifications
│   ├── middleware/            # Validation & auth guards
│   ├── utils/                 # Supabase client
│   └── vercel.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- Supabase project with the required tables (`users`, `posts`, `categories`, `likes`, `comments`, `notifications`, `statuses`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Blog-post.git
   cd Blog-post
   ```
2. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd ../server
   npm install
   ```

### Environment Variables

Create a `.env` file inside `server/` with your Supabase credentials:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Optional: configure the frontend API base URL in `client/.env` (defaults to the current origin when omitted):

```
VITE_API_BASE_URL=http://localhost:4001
```

### Development

Start the backend API (default: http://localhost:4001):
```bash
cd server
npm start
```

Start the Vite dev server (default: http://localhost:5173):
```bash
cd ../client
npm run dev
```

## 📜 Available Scripts

### Frontend (`client/`)
- `npm run dev` – Start Vite development server
- `npm run build` – Build optimized production bundle
- `npm run preview` – Preview the production build locally
- `npm run lint` – Run ESLint across the project

### Backend (`server/`)
- `npm start` – Run the Express server with Nodemon

## 🌐 API Endpoints

### Posts
- `GET /posts` – Public feed with pagination, category filtering, and keyword search
- `GET /posts/:postId` – Single published post with author & category metadata
- `GET /posts/admin` – Admin feed (draft + published) with optional status filter
- `GET /posts/admin/:postId` – Admin view for a specific post
- `POST /posts` – Create a post (authenticated user)
- `PUT /posts/:postId` – Update post fields and status (authenticated author/admin)
- `DELETE /posts/:postId` – Delete post (admin)
- `GET /posts/:postId/like-status` – Check like status for the current user
- `POST /posts/:postId/like` – Toggle like/unlike for a post
- `GET /posts/:postId/comments` – Fetch comments with author avatars
- `POST /posts/:postId/comments` – Add a comment (authenticated user)
- `DELETE /posts/:postId/comments/:commentId` – Remove own comment

### Categories
- `GET /categories` – List all categories
- `GET /categories/:id` – Fetch a single category by ID

### Authentication & Profile
- `POST /auth/register` – Email/password registration with unique username enforcement
- `POST /auth/login` – Login, returning a Supabase access token
- `GET /auth/get-user` – Retrieve the authenticated user profile
- `PUT /auth/update-profile` – Update display name, username, bio, and profile image
- `POST /auth/reset-password` – Update password after verifying the current one

### Notifications
- `GET /notifications` – Fetch unread/read notifications for the logged-in user
- `PUT /notifications/:id/read` – Mark a notification as read
- `PUT /notifications/read-all` – Mark all notifications as read

## 🎨 Pages

**Public**: Landing feed, Post detail, Sign Up, Sign In, Password reset, Profile viewer  
**Authenticated**: Profile editor, Commenting, Like interactions  
**Admin**: Article management, Category management, Notification center, Admin profile & password tools

## 🔐 Development Credentials

Seed Supabase with roles for both `admin` and `user` accounts to experience the full workflow. Tokens are handled automatically by the AuthContext and stored in `localStorage` for API requests.

## 🙌 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Happy blogging! 🚀
