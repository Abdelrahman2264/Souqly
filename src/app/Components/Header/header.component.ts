import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CookieService } from '../../services/cookie.service';
import { CartComponent } from '../Cart/cart.component';
import { FavoritesComponent } from '../Favorites/favorites.component';
import { FavoritesDepComponent } from '../Fav-Departmens/favorites.component';
import { CartService } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';
import { FavoritesDepartmentsService } from '../../services/favorites-depatments.service';
import { UserService, User } from '../../services/user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule, CartComponent, FavoritesComponent, FavoritesDepComponent]
})
export class HeaderComponent implements OnInit {
  isDarkTheme = false;
  isMenuOpen = false;
  showTagline = false;
  currentLogo = 'assets/images/Logo00.png';
  isFavoritesOpen = false;
  isFavoriteDepartmentsOpen = false;
  favoriteCount = 0;
  favoriteDepartmentsCount = 0;
  searchTerm: string = '';

  // Dropdown states
  isDepartmentsOpen = false;
  isProfileOpen = false;
  isJoinUsOpen = false;

  // Mobile navigation states
  mobileSections = {
    departments: false,
    joinus: false
  };

  // Categories loaded from API
  departments: string[] = [];

  isAuthenticated = false;
  currentUser: User | null = null;

  // Cart properties
  isCartOpen = false;
  cartItemCount = 0;

  constructor(
    public cookieService: CookieService,
    public router: Router,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private favoritesDepartmentsService: FavoritesDepartmentsService,
    private userService: UserService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

      if (savedTheme === 'dark') {
        this.applyDarkTheme();
        this.currentLogo = 'assets/images/DarkLogo.png';
      } else {
        this.applyLightTheme();
        this.currentLogo = 'assets/images/Logo00.png';
      }
    }

    this.checkAuthentication();
    this.loadDepartmentsFromApi();

    // Subscribe to user changes
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      this.updateAuthenticationStatus();
    });

    // Subscribe to cart and favorites to keep counts updated with auto-refresh
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });

    this.favoritesService.favorites$.subscribe(items => {
      this.favoriteCount = items.length;
    });

    this.favoritesDepartmentsService.favorites$.subscribe(departments => {
      this.favoriteDepartmentsCount = departments.length;
    });

    // Fallback: react to storage changes from other tabs/windows for real-time updates
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key && event.key.startsWith('souqlyCart_')) {
          this.updateCartCount();
        }
        if (event.key && event.key.startsWith('souqlyFavorites_')) {
          this.updateFavoritesCount();
        }
        if (event.key && event.key.startsWith('souqlyFavoriteDepartments_')) {
          this.updateFavoriteDepartmentsCount();
        }
      });
    }

    // Make cookie service available globally for debugging
    if (typeof window !== 'undefined') {
      (window as any).cookieService = this.cookieService;
      (window as any).clearAllCookies = () => this.cookieService.manualClearAllCookies();
      (window as any).debugStorage = () => this.cookieService.debugAllStorage();
      (window as any).forceLogout = () => this.logout();
      (window as any).testLogout = () => this.testLogout();
      console.log('🔧 Debug methods available globally:');
      console.log('- window.clearAllCookies() - Manual cookie removal');
      console.log('- window.debugStorage() - Debug all storage');
      console.log('- window.forceLogout() - Force logout');
      console.log('- window.testLogout() - Test logout functionality');
      console.log('- window.cookieService - Full service access');
    }
  }

  private loadDepartmentsFromApi() {
    this.http.get<any>('https://dummyjson.com/products/categories').subscribe({
      next: (res) => {
        // Handle both array-of-strings and array-of-objects shapes
        if (Array.isArray(res)) {
          this.departments = res.map((c: any) => typeof c === 'string' ? c : (c?.name || c?.slug || '')).filter(Boolean);
        } else if (res?.categories) {
          this.departments = res.categories.map((c: any) => c?.name || c?.slug).filter(Boolean);
        }
      },
      error: () => {
        this.departments = [];
      }
    });
  }

  updateCartCount() {
    if (typeof localStorage !== 'undefined') {
      const userId = this.userService.getCurrentUserId();
      const cartKey = userId ? `souqlyCart_${userId}` : 'souqlyCart_guest';
      const cartData = localStorage.getItem(cartKey);
      if (cartData) {
        const cartItems = JSON.parse(cartData);
        this.cartItemCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
      } else {
        this.cartItemCount = 0;
      }
    }
  }

  updateFavoritesCount() {
    if (typeof localStorage !== 'undefined') {
      const userId = this.userService.getCurrentUserId();
      const favoritesKey = userId ? `souqlyFavorites_${userId}` : 'souqlyFavorites_guest';
      const favoritesData = localStorage.getItem(favoritesKey);
      if (favoritesData) {
        const favorites = JSON.parse(favoritesData);
        this.favoriteCount = favorites.length;
      } else {
        this.favoriteCount = 0;
      }
    }
  }

  updateFavoriteDepartmentsCount() {
    if (typeof localStorage !== 'undefined') {
      const userId = this.userService.getCurrentUserId();
      const favoritesKey = userId ? `souqlyFavoriteDepartments_${userId}` : 'souqlyFavoriteDepartments_guest';
      const favoritesData = localStorage.getItem(favoritesKey);
      if (favoritesData) {
        const favorites = JSON.parse(favoritesData);
        this.favoriteDepartmentsCount = favorites.length;
      } else {
        this.favoriteDepartmentsCount = 0;
      }
    }
  }

  checkAuthentication(): void {
    // Use the user service to check authentication
    this.isAuthenticated = this.userService.isAuthenticated();
    this.currentUser = this.userService.getCurrentUser();
    console.log('Authentication status:', this.isAuthenticated);
    console.log('Current user:', this.currentUser);
  }

  updateAuthenticationStatus(): void {
    this.isAuthenticated = this.userService.isAuthenticated();
    this.currentUser = this.userService.getCurrentUser();
    console.log('Authentication status updated:', this.isAuthenticated);
  }

  logout(): void {
    console.log('Starting logout process...');

    // Use the user service to logout
    this.userService.logoutUser();

    // Clear authentication cookies
    this.cookieService.delete('souqlyAuth');
    this.cookieService.delete('souqlyUser');

    // Clear authentication from localStorage and sessionStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('souqlyAuth');
      localStorage.removeItem('souqlyUser');
    }

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('souqlyAuth');
      sessionStorage.removeItem('souqlyUser');
    }

    // Update authentication state
    this.isAuthenticated = false;
    this.currentUser = null;

    // Close profile dropdown
    this.isProfileOpen = false;

    // Redirect to home page
    this.router.navigate(['/']).then(() => {
      console.log('Navigation to home completed');
      // Force a reload to ensure clean state
      window.location.reload();
    });

    console.log('Logout process completed');
  }

  testLogout(): void {
    console.log('🧪 Testing logout functionality...');

    // First, check current state
    console.log('Before logout:');
    this.cookieService.debugAllStorage();

    // Perform logout
    this.logout();

    // Check state after logout
    setTimeout(() => {
      console.log('After logout:');
      this.cookieService.debugAllStorage();

      // Verify authentication status
      this.checkAuthentication();
      console.log('Authentication status after logout:', this.isAuthenticated);
    }, 500);
  }

@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  if (!(event.target as Element).closest('.dropdown')) {
    this.closeAllDropdowns();
  }
  
  // Close mobile menu if click is outside of it
  if (this.isMenuOpen && !(event.target as Element).closest('.mobile-nav') && 
      !(event.target as Element).closest('.mobile-menu-btn')) {
    this.closeMobileMenu();
  }
}

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;

    if (this.isDarkTheme) {
      this.applyDarkTheme();
      this.currentLogo = 'assets/images/DarkLogo.png';
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', 'dark');
      }
    } else {
      this.applyLightTheme();
      this.currentLogo = 'assets/images/Logo00.png';
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', 'light');
      }
    }
  }

  applyDarkTheme() {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark-theme');
    }
    this.isDarkTheme = true;
  }

  applyLightTheme() {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark-theme');
    }
    this.isDarkTheme = false;
  }

toggleMenu() {
  this.isMenuOpen = !this.isMenuOpen;
  // Close all dropdowns when toggling mobile menu
  this.closeAllDropdowns();
}


  closeMobileMenu() {
    this.isMenuOpen = false;
    // Close all mobile sections when closing menu
    this.mobileSections['departments'] = false;
    this.mobileSections['joinus'] = false;
  }

  toggleMobileSection(section: 'departments' | 'joinus') {
    this.mobileSections[section] = !this.mobileSections[section];
  }

  onLogoHover(isHovering: boolean) {
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      this.showTagline = isHovering;
    }
  }

  toggleDropdown(dropdown: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    if (dropdown !== 'departments') this.isDepartmentsOpen = false;
    if (dropdown !== 'profile') this.isProfileOpen = false;
    if (dropdown !== 'joinus') this.isJoinUsOpen = false;

    switch (dropdown) {
      case 'departments':
        this.isDepartmentsOpen = !this.isDepartmentsOpen;
        break;
      case 'profile':
        this.isProfileOpen = !this.isProfileOpen;
        break;
      case 'joinus':
        this.isJoinUsOpen = !this.isJoinUsOpen;
        break;
    }
  }

  performSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/Home'], { queryParams: { q: this.searchTerm.trim() } });
    }
  }

  onSearchInput(event: any) {
    // Optional: Add real-time search suggestions or validation here
    // For now, just handle the input event
  }

  closeAllDropdowns() {
    this.isDepartmentsOpen = false;
    this.isProfileOpen = false;
    this.isJoinUsOpen = false;
  }
}