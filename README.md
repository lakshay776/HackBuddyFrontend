# HackBuddy Frontend

A modern React.js frontend for the HackBuddy hackathon platform built with Vite, TailwindCSS, and React Router.

## Features

- 🎯 **Landing Page**: Modern, minimal UI with call-to-action
- 🔐 **Authentication**: Login/Signup with JWT integration
- 🏆 **Hackathons**: Browse and register teams for hackathons
- 👥 **People**: Discover developers and send team invites
- 👨‍💻 **Teams**: Create and manage teams
- 👤 **Profile**: Edit user profile and view projects/experience

## Tech Stack

- **React.js** - Frontend framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library
- **Context API** - State management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.js
│   ├── Card.js
│   ├── Input.js
│   ├── LoadingSpinner.js
│   └── Navbar.js
├── pages/              # Page components
│   ├── Landing.js
│   ├── Login.js
│   ├── Signup.js
│   ├── Hackathons.js
│   ├── People.js
│   ├── Teams.js
│   └── Profile.js
├── context/            # React Context
│   └── AuthContext.js
├── api/                # API integration
│   ├── config.js
│   ├── auth.js
│   ├── teams.js
│   └── hackathons.js
├── utils/              # Utility functions
├── App.js              # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

## API Integration

The frontend integrates with the Express.js backend running on `http://localhost:8000`. All API calls are handled through Axios with automatic JWT token management.

### Available Endpoints

- **Authentication**: `/Hack/Login`, `/Hack/SignUp`
- **Users**: `/Hack/fetchAllUsers`, `/Hack/editProfile`
- **Teams**: `/Hack/createTeam`, `/Hack/getMyTeams`, `/Hack/sendInvite`
- **Hackathons**: `/Hack/fetchAllHackathon`, `/Hack/registerTeamForHackathon`

## Features

### Authentication
- JWT-based authentication
- Automatic token refresh
- Protected routes
- User context management

### Team Management
- Create and manage teams
- Send team invites
- Register teams for hackathons
- View team members

### User Discovery
- Browse user profiles
- Search and filter users
- Send WhatsApp messages
- Add users to teams

### Responsive Design
- Mobile-first approach
- Glassmorphism design elements
- Modern UI components
- Accessible navigation

## Development

### Adding New Components

1. Create component in `src/components/`
2. Follow the existing pattern with proper prop types
3. Use TailwindCSS for styling
4. Export as default

### Adding New Pages

1. Create page in `src/pages/`
2. Add route to `App.js`
3. Use protected route wrapper if needed
4. Follow the existing layout patterns

### API Integration

1. Add new API functions in `src/api/`
2. Use the existing axios instance from `config.js`
3. Handle errors appropriately
4. Update loading states

## Deployment

The app can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables if needed

## Contributing

1. Follow the existing code style
2. Use meaningful component and variable names
3. Add proper error handling
4. Test all functionality before submitting
