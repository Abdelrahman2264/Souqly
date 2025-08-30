import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FavoriteDepartment {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<FavoriteDepartment[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    this.loadFavorites();
    
    // Listen for storage events from other tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === 'souqlyFavoriteDepartments') {
          this.loadFavorites();
        }
      });
    }
  }

  loadFavorites() {
    if (typeof localStorage !== 'undefined') {
      const favoritesData = localStorage.getItem('souqlyFavoriteDepartments');
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
      localStorage.setItem('souqlyFavoriteDepartments', JSON.stringify(items));
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
}