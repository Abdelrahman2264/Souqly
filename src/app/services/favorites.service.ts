import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';

export interface FavoriteItem {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<FavoriteItem[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private userService: UserService) {
    this.loadFavorites();
    
    // Listen for storage events from other tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key && event.key.startsWith('souqlyFavorites_')) {
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
    return userId ? `souqlyFavorites_${userId}` : 'souqlyFavorites_guest';
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

  saveFavorites(items: FavoriteItem[]) {
    if (typeof localStorage !== 'undefined') {
      const favoritesKey = this.getFavoritesKey();
      localStorage.setItem(favoritesKey, JSON.stringify(items));
      this.favoritesSubject.next(items);
    }
  }

  addToFavorites(item: FavoriteItem) {
    const currentItems = this.favoritesSubject.value;
    
    // Check if item already exists in favorites
    const existingItemIndex = currentItems.findIndex(i => i.id === item.id);
    
    if (existingItemIndex === -1) {
      // New item, add to favorites
      this.saveFavorites([...currentItems, item]);
      return true;
    }
    return false;
  }

  removeFromFavorites(itemId: number) {
    const updatedItems = this.favoritesSubject.value.filter(item => item.id !== itemId);
    this.saveFavorites(updatedItems);
  }

  isFavorite(itemId: number): boolean {
    return this.favoritesSubject.value.some(item => item.id === itemId);
  }

  clearFavorites() {
    this.saveFavorites([]);
  }

  getFavorites(): FavoriteItem[] {
    return this.favoritesSubject.value;
  }

  getFavoritesCount(): number {
    return this.favoritesSubject.value.length;
  }

  // Method to transfer guest favorites to user favorites when logging in
  transferGuestFavoritesToUser(userId: string) {
    const guestFavoritesKey = 'souqlyFavorites_guest';
    const userFavoritesKey = `souqlyFavorites_${userId}`;
    
    if (typeof localStorage !== 'undefined') {
      const guestFavoritesData = localStorage.getItem(guestFavoritesKey);
      if (guestFavoritesData) {
        try {
          const guestItems = JSON.parse(guestFavoritesData);
          const userFavoritesData = localStorage.getItem(userFavoritesKey);
          let userItems: FavoriteItem[] = [];
          
          if (userFavoritesData) {
            userItems = JSON.parse(userFavoritesData);
          }
          
          // Merge guest favorites with user favorites, avoiding duplicates
          guestItems.forEach((guestItem: FavoriteItem) => {
            if (!userItems.some(item => item.id === guestItem.id)) {
              userItems.push(guestItem);
            }
          });
          
          // Save merged favorites to user
          localStorage.setItem(userFavoritesKey, JSON.stringify(userItems));
          
          // Clear guest favorites
          localStorage.removeItem(guestFavoritesKey);
          
          // Reload favorites
          this.loadFavorites();
        } catch (e) {
          console.error('Error transferring guest favorites:', e);
        }
      }
    }
  }
}