import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CookieService } from '../../../services/cookie.service';

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
    private cookieService: CookieService
  ) {}

  ngOnInit() {
  // Debug the current URL parameters
  this.route.queryParams.subscribe(params => {
    console.log('Login component - Query params:', params);
    this.returnUrl = params['returnUrl'] || '/dashboard';
    console.log('Login component - Will redirect to:', this.returnUrl);
  });

  // Check if we're already authenticated (which might cause loops)
  const authCookie = this.cookieService.get('souqlyAuth');
  const localAuth = typeof localStorage !== 'undefined' ? localStorage.getItem('souqlyAuth') : null;
  const sessionAuth = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('souqlyAuth') : null;
  
  console.log('Login component - Current auth status:');
  console.log('Cookie:', authCookie);
  console.log('LocalStorage:', localAuth);
  console.log('SessionStorage:', sessionAuth);
  
  // If already authenticated, redirect immediately
  const isAuthed = authCookie === 'true' || localAuth === 'true' || sessionAuth === 'true';
  if (isAuthed) {
    console.log('Login component - Already authenticated, redirecting to dashboard');
    this.router.navigate(['/home']);
  }
}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.showToastMessage('Please enter a valid email and password', 'error');
      return;
    }

    const saved = localStorage.getItem('souqlyUser');
    if (!saved) {
      this.showToastMessage('No user registered with this email. Please sign up first.', 'error');
      return;
    }

    const user = JSON.parse(saved);
    if (user.email === this.email && user.password === this.password) {
      // Create authentication cookie for localhost HTTP
      this.cookieService.set('souqlyAuth', 'true', 7);
      
      // Also store user data in cookie for localhost HTTP
      this.cookieService.set('souqlyUser', JSON.stringify(user), 7);
      
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