# Supabase Authentication System

This document explains how to use the Supabase-based authentication system implemented in this project.

## Overview

The authentication system provides:
- Email/password authentication
- Google OAuth authentication
- React Context for global state management
- Protected routes and components
- Automatic redirects and user state management

## Components

### 1. AuthContext (`src/context/AuthContext.tsx`)

The main authentication context that provides:
- `currentUser`: Current authenticated user (null if not logged in)
- `loading`: Loading state during authentication checks
- `login(email, password)`: Sign in with email/password (Supabase or demo fallback)
- `signup(email, password)`: Create new account
- `logout()`: Sign out current user
- `loginWithGoogle()`: Sign in with Google OAuth (when Supabase OAuth is configured)

### 2. AuthGuard (`src/components/AuthGuard.tsx`)

Protects components and routes:
- Shows loading spinner while checking authentication
- Redirects to login if user is not authenticated
- Renders children if user is authenticated

### 3. ProtectedRoute (`src/components/ProtectedRoute.tsx`)

Wrapper component for protected pages:
- Uses AuthGuard internally
- Adds smooth animations
- Provides fallback UI options

### 4. AuthStatus (`src/components/AuthStatus.tsx`)

Displays current authentication status:
- Shows user information when logged in
- Shows "Not logged in" when not authenticated
- Optional logout button
- Loading state indicator

## Usage Examples

### Basic Authentication Check

```tsx
import { useAuth } from '@/context/AuthContext'

function MyComponent() {
  const { currentUser, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!currentUser) return <div>Please log in</div>

  return <div>Welcome, {currentUser.email}!</div>
}
```

### Protected Route

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'

function Dashboard() {
  return (
    <ProtectedRoute>
      <div>This is a protected dashboard</div>
    </ProtectedRoute>
  )
}
```

### Authentication Status Display

```tsx
import { AuthStatus } from '@/components/AuthStatus'

function Header() {
  return (
    <header>
      <AuthStatus showLogout={true} />
    </header>
  )
}
```

### Login Form

```tsx
import { useAuth } from '@/context/AuthContext'

function LoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      // User will be automatically redirected
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

### Google Login

```tsx
import { useAuth } from '@/context/AuthContext'

function GoogleLoginButton() {
  const { loginWithGoogle } = useAuth()

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      // User will be automatically redirected
    } catch (error) {
      console.error('Google login failed:', error)
    }
  }

  return (
    <button onClick={handleGoogleLogin}>
      Sign in with Google
    </button>
  )
}
```

## Authentication Flow

1. **App Initialization**: AuthProvider wraps the entire app
2. **Authentication Check**: `onAuthStateChanged` listener monitors auth state
3. **User Login**: User signs in via login/signup forms
4. **State Update**: AuthContext updates with new user data
5. **UI Update**: Components re-render with new authentication state
6. **Redirect**: User is redirected to appropriate dashboard
7. **Logout**: User can logout, which clears state and redirects to home

## Environment Variables

Make sure these are set in your `.env.local`:

```env
# Supabase Client Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_public_anon_key

# Server-side (optional)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. In the Authentication settings, enable Email/Password and optional OAuth providers
3. Copy the Project URL and anon key into your `.env` file
4. (Optional) Generate a service role key for secure server-side token validation
5. Configure redirect URLs for OAuth providers if you plan to use them

## Backend API Endpoints

The Express backend now exposes Supabase-backed auth routes so the frontend can proxy sensitive operations without shipping the service role key:

- `POST /api/auth/signup` → Creates a Supabase user, assigns buyer/seller role metadata, and hydrates `profiles`/`seller_profiles`.
- `POST /api/auth/login` → Performs email/password login, returns Supabase access/refresh tokens, and records the active session.
- `POST /api/auth/logout` → Revokes all active tokens for the given user and flags stored sessions as revoked.
- `POST /api/auth/refresh` → Exchanges a refresh token for a fresh access token + session record.
- `POST /api/auth/password/reset` → Sends the Supabase password reset email using the configured redirect URL (`AUTH_PASSWORD_RESET_REDIRECT` in `backend/.env`).

All routes log to the new `auth_events` table and leverage the `user_sessions` table for auditing.

### Required environment variables (backend)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service-role-key
AUTH_PASSWORD_RESET_REDIRECT=https://app.example.com/reset-password
```

## Error Handling

The authentication system includes comprehensive error handling:
- Network errors
- Invalid credentials
- User not found
- Email already in use
- Weak passwords
- OAuth errors

All errors are logged to console and can be displayed to users via toast notifications.

## Security Notes

- All authentication is handled by Supabase
- No sensitive data is stored in local state
- Tokens are managed automatically by Supabase
- Server-side verification will use the Supabase service role client
- Client-side operations use the Supabase JavaScript SDK

## Testing

To test the authentication system:

1. Start the development server
2. Navigate to `/login` or `/signup`
3. Try creating an account with email/password
4. Try logging in with Google
5. Test logout functionality
6. Verify protected routes redirect when not authenticated
7. Check that user state persists across page refreshes
