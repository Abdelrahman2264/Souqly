import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';

export interface FavoriteDepartment {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesDepartmentsService {
  private favoritesSubject = new BehaviorSubject<FavoriteDepartment[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private userService: UserService) {
    this.loadFavorites();
    
    // Listen for storage events from other tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key && event.key.startsWith('souqlyFavoriteDepartments_')) {
          this.loadFavorites();
        }
      });
    }

    // Listen for user changes
    this.userService.currentUser$.subscribe(() => {
      this.loadFavorites();
    });
  }

  private getFavoritesKey(): string {
    const userId = this.userService.getCurrentUserId();
    return userId ? `souqlyFavoriteDepartments_${userId}` : 'souqlyFavoriteDepartments_guest';
  }

  loadFavorites() {
    if (typeof localStorage !== 'undefined') {
      const favoritesKey = this.getFavoritesKey();
      const favoritesData = localStorage.getItem(favoritesKey);
      if (favoritesData) {
        try {
          const items = JSON.parse(favoritesData);
          this.favoritesSubject.next(items);

        } catch (e) {
          console.error('Error parsing favorites data:', e);
          this.favoritesSubject.next([]);
        }
      } else {
        this.favoritesSubject.next([]);
      }
    }
  }

  saveFavorites(items: FavoriteDepartment[]) {
    if (typeof localStorage !== 'undefined') {
      const favoritesKey = this.getFavoritesKey();
      localStorage.setItem(favoritesKey, JSON.stringify(items));
      this.favoritesSubject.next(items);
    }
  }

  addToFavorites(item: FavoriteDepartment) {
    const currentItems = this.favoritesSubject.value;
    
    // Check if department already exists in favorites by name
    const existingItemIndex = currentItems.findIndex(i => i.name === item.name);
    
    if (existingItemIndex === -1) {
      // New department, add to favorites
      this.saveFavorites([...currentItems, item]);
      return true;
    }
    return false;
  }

  removeFromFavorites(departmentName: string) {
    const updatedItems = this.favoritesSubject.value.filter(item => item.name !== departmentName);
    this.saveFavorites(updatedItems);
  }

  isFavorite(departmentName: string): boolean {
    return this.favoritesSubject.value.some(item => item.name === departmentName);
  }

  clearFavorites() {
    this.saveFavorites([]);
  }

  getFavorites(): FavoriteDepartment[] {
    return this.favoritesSubject.value;
  }

  getFavoritesCount(): number {
    return this.favoritesSubject.value.length;
  }

  // Method to transfer guest favorite departments to user favorite departments when logging in
  transferGuestFavoriteDepartmentsToUser(userId: string) {
    const guestFavoritesKey = 'souqlyFavoriteDepartments_guest';
    const userFavoritesKey = `souqlyFavoriteDepartments_${userId}`;
    
    if (typeof localStorage !== 'undefined') {
      const guestFavoritesData = localStorage.getItem(guestFavoritesKey);
      if (guestFavoritesData) {
        try {
          const guestItems = JSON.parse(guestFavoritesData);
          const userFavoritesData = localStorage.getItem(userFavoritesKey);
          let userItems: FavoriteDepartment[] = [];
          
          if (userFavoritesData) {
            userItems = JSON.parse(userFavoritesData);
          }
          
          // Merge guest favorite departments with user favorite departments, avoiding duplicates
          guestItems.forEach((guestItem: FavoriteDepartment) => {
            if (!userItems.some(item => item.name === guestItem.name)) {
              userItems.push(guestItem);
            }
          });
          
          // Save merged favorite departments to user
          localStorage.setItem(userFavoritesKey, JSON.stringify(userItems));
          
          // Clear guest favorite departments
          localStorage.removeItem(guestFavoritesKey);
          
          // Reload favorites
          this.loadFavorites();
        } catch (e) {
          console.error('Error transferring guest favorite departments:', e);
        }
      }
    }
  }
}