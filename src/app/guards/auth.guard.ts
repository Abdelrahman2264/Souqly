import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '../services/cookie.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookieService = inject(CookieService);
  
  try {
    // Check if we have authentication in any storage type
    const authCookie = cookieService.get('souqlyAuth');
    const localAuth = typeof localStorage !== 'undefined' ? localStorage.getItem('souqlyAuth') : null;
    const sessionAuth = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('souqlyAuth') : null;
    
    console.log('AuthGuard - Checking authentication:');
    console.log('Cookie:', authCookie);
    console.log('LocalStorage:', localAuth);
    console.log('SessionStorage:', sessionAuth);
    console.log('Requested URL:', state.url);
    
    const isAuthed = authCookie === 'true' || localAuth === 'true' || sessionAuth === 'true';
    
    if (!isAuthed) {
      console.log('AuthGuard - User not authenticated, redirecting to login');
      // Redirect to login if not authenticated
      router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }
    
    console.log('AuthGuard - User authenticated, allowing access');
    return true;
  } catch (error) {
    console.error('AuthGuard - Error checking authentication:', error);
    // In case of error, redirect to login
    router.navigate(['/login']);
    return false;
  }
};