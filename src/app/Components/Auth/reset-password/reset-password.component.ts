import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../services/theme.service'; // Adjust path as needed
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  password: string = '';
  confirmPassword: string = '';
  passwordStrength: number = 0;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;
  isDarkTheme: boolean = false;
  private themeSubscription!: Subscription;

  // Track individual requirement statuses
  hasMinLength: boolean = false;
  hasLowerCase: boolean = false;
  hasUpperCase: boolean = false;
  hasNumber: boolean = false;
  hasSpecialChar: boolean = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private themeService: ThemeService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Check initial theme
    this.isDarkTheme = document.body.classList.contains('dark-theme');
    
    // Listen for theme changes if your service provides an observable
    // If not, we'll use a different approach
    this.detectThemeChanges();
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  // Detect theme changes - this is a simple implementation
  // You might need to adjust based on how your theme service works
  private detectThemeChanges() {
    // If your theme service provides an observable, use it:
    // this.themeSubscription = this.themeService.themeChanged$.subscribe(isDark => {
    //   this.isDarkTheme = isDark;
    // });
    
    // Otherwise, use a MutationObserver to watch for class changes on body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          this.isDarkTheme = document.body.classList.contains('dark-theme');
        }
      });
    });
    
    observer.observe(document.body, { attributes: true });
    
    // Store the observer to disconnect later
    this.themeSubscription = {
      unsubscribe: () => observer.disconnect()
    } as Subscription;
  }

  // Check password strength and individual requirements
  checkPasswordStrength() {
    this.hasMinLength = this.password.length >= 8;
    this.hasLowerCase = /[a-z]/.test(this.password);
    this.hasUpperCase = /[A-Z]/.test(this.password);
    this.hasNumber = /\d/.test(this.password);
    this.hasSpecialChar = /[@$!%*?&]/.test(this.password);
    
    let strength = 0;
    
    // Length check
    if (this.hasMinLength) strength += 20;
    
    // Lowercase check
    if (this.hasLowerCase) strength += 20;
    
    // Uppercase check
    if (this.hasUpperCase) strength += 20;
    
    // Number check
    if (this.hasNumber) strength += 20;
    
    // Special character check
    if (this.hasSpecialChar) strength += 20;
    
    this.passwordStrength = strength;
  }

  // Validate if passwords match
  passwordsMatch(): boolean {
    return this.password === this.confirmPassword && this.password !== '';
  }

  // Check if password is strong
  isPasswordStrong(): boolean {
    return this.hasMinLength && 
           this.hasLowerCase && 
           this.hasUpperCase && 
           this.hasNumber && 
           this.hasSpecialChar;
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Toggle confirm password visibility
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Handle form submission
  onSubmit() {
    if (!this.passwordsMatch()) {
      this.toastr.error('Passwords do not match');
      return;
    }

    if (!this.isPasswordStrong()) {
      this.toastr.error('Password is not strong enough');
      return;
    }

    this.isLoading = true;
    
    // Save the new password to localStorage
    this.updatePasswordInLocalStorage();
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.toastr.success('Password reset successfully!');
      this.router.navigate(['/login']);
    }, 2000);
  }

  // Update password in localStorage
  private updatePasswordInLocalStorage() {
    try {
      // Get the current user from user service
      const currentUser = this.userService.getCurrentUser();
      
      if (currentUser) {
        // Update the password using user service
        const updatedUser = this.userService.updateUserProfile(currentUser.id, {
          password: this.password
        });
        
        if (updatedUser) {
          console.log('Password updated successfully');
          this.toastr.info('Password updated successfully');
        } else {
          this.toastr.error('Failed to update password');
        }
      } else {
        // If no user exists, create a demo user (for testing purposes)
        this.createDemoUserWithNewPassword();
      }
    } catch (error) {
      console.error('Error updating password:', error);
      this.toastr.error('Failed to save password');
    }
  }

  // Create a demo user with the new password (for testing)
  private createDemoUserWithNewPassword() {
    const demoUser = {
      email: 'user@example.com',
      password: this.password,
      name: 'Demo User',
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('souqlyUser', JSON.stringify(demoUser));
    console.log('Demo user created with new password');
    this.toastr.info('Demo account created with your new password');
  }

  // Get password strength text
  getPasswordStrengthText(): string {
    if (this.password.length === 0) return '';
    
    if (this.passwordStrength < 40) return 'Weak';
    if (this.passwordStrength < 80) return 'Medium';
    return 'Strong';
  }

  // Get password strength color
  getPasswordStrengthColor(): string {
    if (this.password.length === 0) return this.isDarkTheme ? '#374151' : '#e0e0e0';
    
    if (this.passwordStrength < 40) return '#f44336';
    if (this.passwordStrength < 80) return '#ff9800';
    return '#4caf50';
  }
}
