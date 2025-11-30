# MasterProDev Official Website

A standalone React + Vite consultant marketplace platform built without external dependencies like Base44.

## Features

- 🎯 Consultant marketplace
- 👥 User authentication & profiles
- ⭐ Rating & review system
- 🔍 Search functionality
- 📱 Responsive design with Tailwind CSS
- 🎨 Beautiful UI components (Radix UI)
- ⚡ Fast build with Vite

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Radix UI
- **Routing**: React Router v7
- **API Client**: Axios
- **State Management**: React Context API + React Query
- **Icons**: Lucide React
- **Form Management**: React Hook Form

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

Create a `.env` file based on `.env.example`:

```env
# Point to your backend API
VITE_API_URL=http://localhost:3000/api
```

## Project Structure

```
src/
├── api/              # API client configuration
├── components/       # React components
│   ├── home/        # Home page sections
│   ├── shared/      # Shared components
│   └── ui/          # UI component library
├── entities/        # Data models & services
├── hooks/           # Custom React hooks
├── lib/             # Utilities & context
├── pages/           # Page components
└── utils/           # Helper functions
```

## Authentication

The app uses JWT token-based authentication. User service located at `src/entities/User.js`:

```javascript
// Login
await User.login(email, password);

// Get current user
const user = await User.me();

// Logout
await User.logout();
```

Tokens are stored in `localStorage` under the key `auth_token`.

## API Integration

All API calls go through the Axios client in `src/api/base44Client.js`. The client automatically:

- Adds authentication token to requests
- Handles 401 errors (redirects to login)
- Sets proper headers

## Building

```bash
# Development build
npm run build

# Production deployment
npm run build
# Deploy the `dist/` folder
```

## Deployment

### Netlify
1. Connect your GitHub repository
2. Set `VITE_API_URL` in Environment variables
3. Build command: `npm run build`
4. Publish directory: `dist`

### Vercel
1. Import repository from GitHub
2. Set `VITE_API_URL` in Environment variables
3. Auto-configures for Vite

## License

Private - All rights reserved

---

**Note**: This is a frontend-only application. You'll need to set up your own backend API to handle authentication and data operations.
