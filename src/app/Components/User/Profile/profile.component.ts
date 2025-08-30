// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoritesService as FavoritesDepartmentsService, FavoriteDepartment } from '../../../services/favorites-depatments.service';
import { FavoritesService, FavoriteItem } from '../../../services/favorites.service';
import { FavoritesComponent } from '../../Favorites/favorites.component';
import { FavoritesDepComponent } from '../../Fav-Departmens/favorites.component';

interface SouqlyUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  dob?: string;
  gender?: string;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, FavoritesComponent, FavoritesDepComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    dateOfBirth: '',
    gender: ''
  };

  age: number = 0;
  isEditing: boolean = false;
  isDarkTheme: boolean = false;

  favoriteItems: FavoriteItem[] = [];
  favoriteDepartments: FavoriteDepartment[] = [];
  showFavItemsSidebar = false;
  showFavDepartmentsSidebar = false;

  // Sample countries for the dropdown
  countries: string[] = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
    'France', 'Japan', 'Brazil', 'India', 'China', 'Mexico', 'Spain'
  ];

  constructor(
    private favoritesDepartmentsService: FavoritesDepartmentsService,
    private favoritesService: FavoritesService
  ) { }

  ngOnInit(): void {
    this.loadThemePreference();
    this.loadUserFromLocalStorage();
    this.calculateAge();
    this.loadFavorites();
  }

  loadThemePreference(): void {
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || localStorage.getItem('themePreference');
      this.isDarkTheme = savedTheme === 'dark';
      this.applyTheme();
    }
  }

  setTheme(isDark: boolean): void {
    this.isDarkTheme = isDark;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
    this.applyTheme();
  }

  applyTheme(): void {
    if (typeof document !== 'undefined') {
      if (this.isDarkTheme) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    }
  }

  loadUserFromLocalStorage(): void {
    // Prefer the app's user key, fall back to older key if present
    const rawSouqly = localStorage.getItem('souqlyUser');
    const rawLegacy = localStorage.getItem('currentUser');

    if (rawSouqly || rawLegacy) {
      const parsed: SouqlyUser = rawSouqly ? JSON.parse(rawSouqly) : JSON.parse(rawLegacy as string);
      // Map stored fields into view model
      this.user = {
        firstName: parsed.firstName || '',
        lastName: parsed.lastName || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        country: parsed.country || '',
        city: parsed.city || '',
        dateOfBirth: (parsed.dob || ''),
        gender: parsed.gender || ''
      };
      // Ensure the current country appears in dropdown even if not in the preset list
      if (this.user.country && !this.countries.includes(this.user.country)) {
        this.countries = [this.user.country, ...this.countries];
      }
    } else {
      // Set some default data for demonstration
      this.user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        country: 'United States',
        city: 'New York',
        dateOfBirth: '1990-05-15',
        gender: 'male'
      };
      this.saveUserToLocalStorage();
    }

    this.calculateAge();
  }

  loadFavorites(): void {
    try {
      // Load favorite items from FavoritesService
      this.favoriteItems = this.favoritesService.getFavorites();

      // Subscribe to changes in favorite items for auto-refresh
      this.favoritesService.favorites$.subscribe(items => {
        this.favoriteItems = items;
      });

      // Load favorite departments from FavoritesDepartmentsService
      this.favoriteDepartments = this.favoritesDepartmentsService.getFavorites();

      // Subscribe to changes in favorite departments for auto-refresh
      this.favoritesDepartmentsService.favorites$.subscribe(departments => {
        this.favoriteDepartments = departments;
      });
    } catch {
      this.favoriteItems = [];
      this.favoriteDepartments = [];
    }
  }

  saveUserToLocalStorage(): void {
    const toSave: SouqlyUser = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phone: this.user.phone,
      country: this.user.country,
      city: this.user.city,
      dob: this.user.dateOfBirth,
      gender: this.user.gender
    };
    localStorage.setItem('souqlyUser', JSON.stringify(toSave));
  }

  calculateAge(): void {
    if (this.user.dateOfBirth) {
      const birthDate = new Date(this.user.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();

      // Adjust age if birthday hasn't occurred yet this year
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      this.age = age;
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    this.saveUserToLocalStorage();
    this.calculateAge();
    this.isEditing = false;
  }

  // Sidebars toggle
  openFavItemsSidebar(): void { this.showFavItemsSidebar = true; }
  openFavDepartmentsSidebar(): void { this.showFavDepartmentsSidebar = true; }
  closeSidebars(): void {
    this.showFavItemsSidebar = false;
    this.showFavDepartmentsSidebar = false;
  }

  onDateChange(event: any): void {
    this.user.dateOfBirth = event.target.value;
    this.calculateAge();
  }

  // Remove a favorite department
  removeDepartment(department: FavoriteDepartment): void {
    this.favoritesDepartmentsService.removeFromFavorites(department.name);
  }
}