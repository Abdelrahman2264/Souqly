# Souqly User System Implementation

## Overview
This project now implements a comprehensive user management system where each user has their own unique profile, cart, favorites, and favorite departments. All data is stored per user ID in localStorage, ensuring complete separation between users.

## Key Features

### 1. User Registration & Authentication
- **Unique User IDs**: Each user gets a unique ID (format: `user_timestamp_randomstring`)
- **User Profiles**: Complete user information storage with validation
- **Secure Login**: Email/password authentication system
- **Session Management**: Automatic login state management

### 2. User-Specific Data Storage
- **Cart Items**: Each user has their own shopping cart
- **Favorites**: User-specific product favorites
- **Favorite Departments**: User-specific department preferences
- **Guest Support**: Anonymous users can use the system, data transfers to user account upon login

### 3. Data Structure
```
localStorage:
├── souqlyUsers (array of all registered users)
├── souqlyCurrentUser (currently logged-in user)
├── souqlyCart_[userId] (user-specific cart)
├── souqlyFavorites_[userId] (user-specific favorites)
├── souqlyFavoriteDepartments_[userId] (user-specific favorite departments)
├── souqlyCart_guest (guest cart)
├── souqlyFavorites_guest (guest favorites)
└── souqlyFavoriteDepartments_guest (guest favorite departments)
```

## How It Works

### Registration Process
1. User fills out registration form
2. System generates unique ID
3. Creates user profile with empty cart/favorites
4. Stores user in `souqlyUsers` array
5. Creates user-specific storage keys

### Login Process
1. User enters email/password
2. System validates credentials
3. Sets current user
4. Transfers any guest data to user account
5. Loads user-specific data

### Data Operations
- **Cart**: All cart operations use `souqlyCart_[userId]` key
- **Favorites**: All favorite operations use `souqlyFavorites_[userId]` key
- **Departments**: All department operations use `souqlyFavoriteDepartments_[userId]` key

## Services

### UserService
- `registerUser()`: Creates new user with unique ID
- `loginUser()`: Authenticates and sets current user
- `logoutUser()`: Clears current user session
- `updateUserProfile()`: Updates user information
- `deleteUser()`: Removes user and all associated data

### CartService
- Automatically uses current user ID for storage
- Falls back to guest storage for anonymous users
- `transferGuestCartToUser()`: Merges guest cart with user cart

### FavoritesService
- User-specific favorites storage
- `transferGuestFavoritesToUser()`: Merges guest favorites with user favorites

### FavoritesDepartmentsService
- User-specific department preferences
- `transferGuestFavoriteDepartmentsToUser()`: Merges guest departments with user departments

## Usage Examples

### Register a New User
```typescript
const userData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  country: 'United States',
  city: 'New York',
  gender: 'male',
  dob: '1990-01-01',
  password: 'SecurePass123!'
};

const newUser = this.userService.registerUser(userData);
console.log('User ID:', newUser.id); // user_1703123456789_abc123def
```

### Login User
```typescript
const user = this.userService.loginUser('john@example.com', 'SecurePass123!');
if (user) {
  console.log('Logged in as:', user.firstName);
  console.log('User ID:', user.id);
}
```

### Add to Cart (User-Specific)
```typescript
// Automatically uses current user's cart
this.cartService.addToCart(product);
```

### Check Authentication
```typescript
if (this.userService.isAuthenticated()) {
  const userId = this.userService.getCurrentUserId();
  console.log('Current user ID:', userId);
}
```

## Benefits

1. **Complete User Isolation**: Each user's data is completely separate
2. **Guest Support**: Anonymous users can use the system
3. **Data Persistence**: User data persists across sessions
4. **Scalable**: Can handle unlimited users
5. **Secure**: Each user only accesses their own data
6. **Seamless Experience**: Guest data transfers to user account upon login

## Testing

1. **Register Multiple Users**: Create several accounts to test isolation
2. **Add Items as Guest**: Add products to cart while not logged in
3. **Login**: Log in and verify guest data transfers
4. **User Switching**: Log out and log in as different users
5. **Data Persistence**: Refresh page and verify data remains

## Security Notes

- This is a client-side implementation for demonstration purposes
- In production, implement proper server-side authentication
- Add password hashing and encryption
- Implement proper session management
- Add rate limiting and validation

## Future Enhancements

1. **Server Integration**: Move to backend database
2. **Password Hashing**: Implement bcrypt or similar
3. **JWT Tokens**: Add proper session management
4. **Data Encryption**: Encrypt sensitive user data
5. **User Roles**: Add admin/user role system
6. **Data Export**: Allow users to export their data
7. **Account Recovery**: Implement password reset functionality
