import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  gender: string;
  dob: string;
  password: string;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  user: User;
  cart: any[];
  favorites: any[];
  favoriteDepartments: any[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly USERS_KEY = 'souqlyUsers';
  private readonly CURRENT_USER_KEY = 'souqlyCurrentUser';

  constructor() {
    this.loadCurrentUser();
  }

  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getUsers(): User[] {
    if (typeof localStorage !== 'undefined') {
      const usersData = localStorage.getItem(this.USERS_KEY);
      return usersData ? JSON.parse(usersData) : [];
    }
    return [];
  }

  private saveUsers(users: User[]): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }

  private getUserProfile(userId: string): UserProfile | null {
    if (typeof localStorage !== 'undefined') {
      const profileData = localStorage.getItem(`souqlyProfile_${userId}`);
      return profileData ? JSON.parse(profileData) : null;
    }
    return null;
  }

  private saveUserProfile(profile: UserProfile): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`souqlyProfile_${profile.id}`, JSON.stringify(profile));
    }
  }

  registerUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      ...userData,
      id: this.generateUserId(),
      createdAt: new Date()
    };

    users.push(newUser);
    this.saveUsers(users);

    // Create user profile
    const userProfile: UserProfile = {
      id: newUser.id,
      user: newUser,
      cart: [],
      favorites: [],
      favoriteDepartments: []
    };
    this.saveUserProfile(userProfile);

    return newUser;
  }

  loginUser(email: string, password: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.setCurrentUser(user);
      return user;
    }
    
    return null;
  }

  logoutUser(): void {
    this.currentUserSubject.next(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  private loadCurrentUser(): void {
    if (typeof localStorage !== 'undefined') {
      const userData = localStorage.getItem(this.CURRENT_USER_KEY);
      if (userData) {
        try {
          const user = JSON.parse(userData);
          this.currentUserSubject.next(user);
        } catch (e) {
          console.error('Error parsing current user data:', e);
        }
      }
    }
  }

  updateUserProfile(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return null;

    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);

    // Update current user if it's the same user
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(users[userIndex]);
    }

    return users[userIndex];
  }

  deleteUser(userId: string): boolean {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return false;

    users.splice(userIndex, 1);
    this.saveUsers(users);

    // Remove user profile
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`souqlyProfile_${userId}`);
    }

    // If deleting current user, logout
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.logoutUser();
    }

    return true;
  }

  getAllUsers(): User[] {
    return this.getUsers();
  }

  getUserById(userId: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.id === userId) || null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
