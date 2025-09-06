// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService, User } from '../../../services/user.service';
import { CartService } from '../../../services/cart.service';
import { FavoritesService } from '../../../services/favorites.service';
import { FavoritesDepartmentsService } from '../../../services/favorites-depatments.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  isEditing = false;
  showToast = false;
  toastMessage = '';
  toastType = 'success';
  
  // Form data
  editForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    gender: '',
    dob: ''
  };

  // Statistics
  cartItemCount = 0;
  favoritesCount = 0;
  favoriteDepartmentsCount = 0;
  
  countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'Japan', 'Brazil', 'India', 'China', 'Mexico', 'Italy',
    'Spain', 'South Africa', 'Nigeria', 'Egypt', 'Kenya', 'Ghana'
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private favoritesDepartmentsService: FavoritesDepartmentsService
  ) {}

  ngOnInit() {
    // Check if user is authenticated
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.userService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Initialize form with current user data
    this.initializeForm();
    
    // Load user statistics
    this.loadUserStatistics();
  }

  private initializeForm() {
    if (this.currentUser) {
      this.editForm = {
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
        phone: this.currentUser.phone,
        country: this.currentUser.country,
        city: this.currentUser.city,
        gender: this.currentUser.gender,
        dob: this.currentUser.dob
      };
    }
  }

  private loadUserStatistics() {
    // Get cart count
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });

    // Get favorites count
    this.favoritesService.favorites$.subscribe(items => {
      this.favoritesCount = items.length;
    });

    // Get favorite departments count
    this.favoritesDepartmentsService.favorites$.subscribe(departments => {
      this.favoriteDepartmentsCount = departments.length;
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.initializeForm();
    }
  }

  onSave(form: NgForm) {
    if (!form.valid || !this.currentUser) {
      this.showToastMessage('Please fill all required fields correctly');
      return;
    }

    try {
      // Update user profile
      const updatedUser = this.userService.updateUserProfile(this.currentUser.id, this.editForm);
      
      if (updatedUser) {
        this.currentUser = updatedUser;
        this.isEditing = false;
        this.showToastMessage('Profile updated successfully!', 'success');
      } else {
        this.showToastMessage('Failed to update profile. Please try again.');
      }
    } catch (error: any) {
      this.showToastMessage(error.message || 'Failed to update profile. Please try again.');
    }
  }

  onCancel() {
    this.isEditing = false;
    this.initializeForm();
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (this.currentUser) {
        try {
          const success = this.userService.deleteUser(this.currentUser.id);
          if (success) {
            this.showToastMessage('Account deleted successfully', 'success');
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1500);
          } else {
            this.showToastMessage('Failed to delete account. Please try again.');
          }
        } catch (error: any) {
          this.showToastMessage(error.message || 'Failed to delete account. Please try again.');
        }
      }
    }
  }

  private showToastMessage(message: string, type: 'success' | 'error' = 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  getAccountAge(): string {
    if (!this.currentUser) return '';
    
    const createdAt = new Date(this.currentUser.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  }
}