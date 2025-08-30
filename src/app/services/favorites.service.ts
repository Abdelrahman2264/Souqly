import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  constructor() {
    this.loadFavorites();
    
    // Listen for storage events from other tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === 'souqlyFavorites') {
          this.loadFavorites();
        }
      });
    }
  }

  loadFavorites() {
    if (typeof localStorage !== 'undefined') {
      const favoritesData = localStorage.getItem('souqlyFavorites');
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
      localStorage.setItem('souqlyFavorites', JSON.stringify(items));
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
}