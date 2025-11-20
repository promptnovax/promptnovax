# Role-Based Access Control (RBAC) System

This document explains the Role-Based Access Control system implemented using Firebase Firestore for managing Seller and Buyer user roles.

## Overview

The RBAC system provides:
- **Role-based authentication** with Seller and Buyer roles
- **Firestore integration** for storing user roles
- **Route protection** based on user roles
- **Dynamic navigation** based on user permissions
- **Automatic role assignment** during signup

## Architecture

### 1. Firestore Database Structure

```
users/{uid} {
  uid: string,
  email: string,
  role: 'seller' | 'buyer',
  createdAt: timestamp
}
```

### 2. Authentication Flow

1. **User Signup**: User selects role (Seller/Buyer) during registration
2. **Firestore Document**: User document created with selected role
3. **Login**: User role fetched from Firestore and stored in context
4. **Route Protection**: Components check user role before rendering
5. **Navigation**: Dynamic dashboard links based on user role

## Components

### 1. AuthContext (`src/context/AuthContext.tsx`)

Extended with role-based functionality:

```typescript
interface AuthContextType {
  currentUser: User | null
  userRole: UserRole | null  // New: User role information
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, role?: 'seller' | 'buyer') => Promise<void>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
}
```

**Key Features:**
- **Role Storage**: Creates user document in Firestore with role
- **Role Fetching**: Retrieves user role on authentication
- **Google OAuth**: Assigns default 'buyer' role for Google sign-ins
- **Role Persistence**: Maintains role state across sessions

### 2. RoleGuard (`src/components/RoleGuard.tsx`)

Protects components and routes based on user roles:

```typescript
interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]        // Array of allowed roles
  fallback?: ReactNode         // Custom fallback UI
  redirectTo?: string          // Redirect path for unauthorized access
}
```

**Usage Examples:**

```tsx
// Protect seller-only content
<RoleGuard allowedRoles={['seller']}>
  <SellerDashboard />
</RoleGuard>

// Protect buyer-only content
<RoleGuard allowedRoles={['buyer']}>
  <BuyerDashboard />
</RoleGuard>

// Allow both roles
<RoleGuard allowedRoles={['seller', 'buyer']}>
  <SharedContent />
</RoleGuard>
```

### 3. Dashboard Pages

#### Seller Dashboard (`src/pages/dashboard/seller-dashboard.tsx`)
- **Access**: Seller role only
- **Features**: Sales analytics, prompt management, earnings tracking
- **Protection**: `<RoleGuard allowedRoles={['seller']}>`

#### Buyer Dashboard (`src/pages/dashboard/buyer-dashboard.tsx`)
- **Access**: Buyer role only
- **Features**: Purchase history, wishlist, prompt discovery
- **Protection**: `<RoleGuard allowedRoles={['buyer']}>`

### 4. Unauthorized Page (`src/pages/unauthorized/unauthorized.tsx`)
- **Purpose**: Displayed when user lacks required permissions
- **Features**: Clear error message, navigation options, role information
- **Access**: Public (no authentication required)

## Usage Examples

### 1. Role-Based Component Rendering

```tsx
import { useAuth } from '@/context/AuthContext'

function MyComponent() {
  const { userRole, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  
  if (userRole?.role === 'seller') {
    return <SellerContent />
  }
  
  if (userRole?.role === 'buyer') {
    return <BuyerContent />
  }
  
  return <div>Please log in</div>
}
```

### 2. Role-Based Route Protection

```tsx
import { RoleGuard } from '@/components/RoleGuard'

function AdminPanel() {
  return (
    <RoleGuard allowedRoles={['seller']}>
      <div>Admin content for sellers only</div>
    </RoleGuard>
  )
}
```

### 3. Role-Based Navigation

```tsx
import { useAuth } from '@/context/AuthContext'

function Navigation() {
  const { userRole } = useAuth()
  
  const getDashboardLink = () => {
    if (userRole?.role === 'seller') return '#dashboard/seller'
    if (userRole?.role === 'buyer') return '#dashboard/buyer'
    return '#dashboard'
  }
  
  return (
    <Link href={getDashboardLink()}>
      Dashboard
    </Link>
  )
}
```

### 4. Role-Based Signup

```tsx
import { useAuth } from '@/context/AuthContext'

function SignupForm() {
  const { signup } = useAuth()
  const [role, setRole] = useState<'seller' | 'buyer'>('buyer')
  
  const handleSubmit = async (email: string, password: string) => {
    await signup(email, password, role)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
      </select>
      {/* Other form fields */}
    </form>
  )
}
```

## Role Definitions

### Seller Role
- **Access**: Seller dashboard, prompt creation, sales analytics
- **Features**: Upload prompts, manage listings, view earnings
- **Dashboard**: `/dashboard/seller`

### Buyer Role
- **Access**: Buyer dashboard, marketplace browsing, purchase history
- **Features**: Buy prompts, manage wishlist, leave reviews
- **Dashboard**: `/dashboard/buyer`

## Security Considerations

### 1. Client-Side Protection
- **RoleGuard**: Prevents unauthorized UI rendering
- **Route Protection**: Blocks access to restricted pages
- **Navigation**: Hides unauthorized menu items

### 2. Server-Side Validation
- **Firestore Rules**: Secure database access
- **API Endpoints**: Validate user roles server-side
- **Token Verification**: Verify user permissions

### 3. Data Security
- **Role Storage**: Roles stored securely in Firestore
- **Permission Checks**: Multiple layers of validation
- **Error Handling**: Graceful handling of permission errors

## Error Handling

### 1. Unauthorized Access
- **Automatic Redirect**: Users redirected to unauthorized page
- **Clear Messaging**: Explains why access was denied
- **Navigation Options**: Provides alternative routes

### 2. Role Loading Errors
- **Fallback UI**: Shows loading state during role fetch
- **Error Recovery**: Handles network and permission errors
- **User Feedback**: Clear error messages

### 3. Missing Roles
- **Default Assignment**: Google OAuth users get 'buyer' role
- **Role Creation**: Automatic role document creation
- **Validation**: Ensures role exists before access

## Testing

### 1. Role-Based Access
- Test seller dashboard access with seller role
- Test buyer dashboard access with buyer role
- Test unauthorized access with wrong role

### 2. Navigation
- Verify dashboard links show correct role-based URLs
- Test navigation between role-specific pages
- Confirm unauthorized page redirects

### 3. Signup Flow
- Test role selection during registration
- Verify role assignment in Firestore
- Test Google OAuth default role assignment

## Future Enhancements

### 1. Additional Roles
- **Admin Role**: System administration
- **Moderator Role**: Content moderation
- **Premium Role**: Enhanced features

### 2. Role Permissions
- **Granular Permissions**: Fine-grained access control
- **Feature Flags**: Role-based feature toggles
- **Dynamic Roles**: Runtime role assignment

### 3. Advanced Features
- **Role Inheritance**: Hierarchical role system
- **Temporary Roles**: Time-limited permissions
- **Role Auditing**: Track role changes

## Troubleshooting

### Common Issues

1. **Role Not Loading**
   - Check Firestore connection
   - Verify user document exists
   - Check authentication state

2. **Unauthorized Access**
   - Verify user role in Firestore
   - Check RoleGuard configuration
   - Confirm route protection

3. **Navigation Issues**
   - Check role-based link generation
   - Verify dashboard route configuration
   - Test role state updates

### Debug Tools

```typescript
// Check current user role
const { userRole } = useAuth()
console.log('Current role:', userRole?.role)

// Check role permissions
const { hasPermission } = useRoleGuard(['seller'])
console.log('Has seller permission:', hasPermission)
```

## Conclusion

The RBAC system provides a robust foundation for role-based access control in the application. It ensures secure access to role-specific features while maintaining a smooth user experience through proper error handling and navigation.
