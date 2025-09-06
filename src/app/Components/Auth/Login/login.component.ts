import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CookieService } from '../../../services/cookie.service';
import { UserService } from '../../../services/user.service';
import { CartService } from '../../../services/cart.service';
import { FavoritesService } from '../../../services/favorites.service';
import { FavoritesDepartmentsService } from '../../../services/favorites-depatments.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  returnUrl: string = '/dashboard'; // Default redirect

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private userService: UserService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private favoritesDepartmentsService: FavoritesDepartmentsService
  ) {}

  ngOnInit() {
    // Debug the current URL parameters
    this.route.queryParams.subscribe(params => {
      console.log('Login component - Query params:', params);
      this.returnUrl = params['returnUrl'] || '/dashboard';
      console.log('Login component - Will redirect to:', this.returnUrl);
    });

    // Check if we're already authenticated
    if (this.userService.isAuthenticated()) {
      console.log('Login component - Already authenticated, redirecting to dashboard');
      this.router.navigate(['/home']);
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.showToastMessage('Please enter a valid email and password', 'error');
      return;
    }

    try {
      // Use the user service to login
      const user = this.userService.loginUser(this.email, this.password);
      
      if (user) {
        // Create authentication cookie for localhost HTTP
        this.cookieService.set('souqlyAuth', 'true', 7);
        
        // Also store user data in cookie for localhost HTTP
        this.cookieService.set('souqlyUser', JSON.stringify(user), 7);
        
        // Transfer guest data to user data
        this.transferGuestDataToUser(user.id);
        
        this.showToastMessage('Welcome back! Redirecting...', 'success');
        
        // Navigate to the returnUrl or dashboard after a short delay
        setTimeout(() => {
          this.router.navigateByUrl(this.returnUrl).then(success => {
            if (!success) {
              console.error('Failed to navigate to', this.returnUrl);
              // Fallback to dashboard if the intended route fails
              this.router.navigate(['/dashboard']);
            }
          });
        }, 1500);
      } else {
        this.showToastMessage('Invalid email or password', 'error');
      }
    } catch (error: any) {
      this.showToastMessage( 'Login failed. Please try again.','error');
    }
  }

  private transferGuestDataToUser(userId: string) {
    // Transfer guest cart, favorites, and favorite departments to user
    this.cartService.transferGuestCartToUser(userId);
    this.favoritesService.transferGuestFavoritesToUser(userId);
    this.favoritesDepartmentsService.transferGuestFavoriteDepartmentsToUser(userId);
  }

  // Function to show toast message
  private showToastMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}