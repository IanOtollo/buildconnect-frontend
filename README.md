# BuildConnect Frontend

Professional React + TypeScript frontend for the BuildConnect platform.

## Features

- Clean, professional UI design with Tailwind CSS
- Client and Contractor dashboards
- Secure authentication with JWT
- Service request management
- Wallet and payment integration
- Real-time contractor matching
- Review and rating system

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Context API for state management

## Prerequisites

- Node.js 16+ and npm
- BuildConnect backend running on http://localhost:8000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend URL:
```
REACT_APP_API_URL=http://localhost:8000/api
```

## Development

Start the development server:
```bash
npm start
```

The app will open at http://localhost:3000

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard:
   - `REACT_APP_API_URL` = your production API URL

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `build` folder to Netlify

3. Set environment variables in Netlify dashboard

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx
│   ├── Button.tsx
│   └── Input.tsx
├── pages/              # Page components
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ClientDashboard.tsx
│   └── ContractorDashboard.tsx
├── services/           # API services
│   └── api.ts
├── context/            # React context providers
│   └── AuthContext.tsx
├── types/              # TypeScript types
│   └── index.ts
├── App.tsx             # Main app component with routing
└── index.tsx           # App entry point
```

## Available Routes

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration (Client/Contractor)
- `/client/dashboard` - Client dashboard (protected)
- `/contractor/dashboard` - Contractor dashboard (protected)

## Environment Variables

- `REACT_APP_API_URL` - Backend API base URL (default: http://localhost:8000/api)
