import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  
  get(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  set(name: string, value: string, days: number, path: string = '/'): void {
    if (typeof document === 'undefined') return;
    
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    
    // For localhost HTTP - avoid Secure flag and specify domain
    let domain = '';
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      domain = '; domain=localhost';
    }
    
    document.cookie = name + "=" + value + expires + "; path=" + path + domain + "; SameSite=Lax";
  }

  delete(name: string, path: string = '/'): void {
    if (typeof document === 'undefined') return;
    
    // More aggressive cookie deletion for localhost
    const deletionAttempts = [
      // Basic deletion
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`,
      // With localhost domain
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=localhost`,
      // With 127.0.0.1 domain
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=127.0.0.1`,
      // With dot prefix for localhost
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=.localhost`,
      // With dot prefix for 127.0.0.1
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=.127.0.0.1`,
      // Without domain (current domain)
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`,
      // Root path
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`,
      // Root path with localhost domain
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=localhost`,
      // Root path with 127.0.0.1 domain
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=127.0.0.1`,
      // Empty domain
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=`,
      // Max-age approach
      `${name}=; max-age=0; path=${path}`,
      `${name}=; max-age=0; path=/`,
      // Max-age with domain
      `${name}=; max-age=0; path=${path}; domain=localhost`,
      `${name}=; max-age=0; path=/; domain=localhost`
    ];
    
    deletionAttempts.forEach(attempt => {
      document.cookie = attempt;
    });
    
    console.log(`Attempted to delete cookie: ${name} with ${deletionAttempts.length} different approaches`);
  }

  clearAuthCookies(): void {
    console.log('Starting auth cookie cleanup...');
    
    // List cookies before deletion
    console.log('Cookies before deletion:', this.listAllCookies());
    
    // Delete each cookie with multiple approaches
    this.delete('souqlyAuth');
    this.delete('souqlyUser');
    
    // Additional aggressive deletion
    this.aggressiveCookieRemoval();
    
    console.log('Auth cookies cleared');
    
    // List cookies after deletion
    setTimeout(() => {
      console.log('Cookies after deletion:', this.listAllCookies());
    }, 100);
  }

  // Additional aggressive cookie removal method
  private aggressiveCookieRemoval(): void {
    console.log('Performing aggressive cookie removal...');
    
    // Get all current cookies
    const allCookies = this.listAllCookies();
    
    // Remove each cookie individually with all possible combinations
    allCookies.forEach(cookie => {
      if (cookie.name.includes('souqly')) {
        console.log(`Aggressively removing cookie: ${cookie.name}`);
        
        // Try every possible combination
        const domains = ['', 'localhost', '127.0.0.1', '.localhost', '.127.0.0.1'];
        const paths = ['/', '/dashboard', '/login', '/signup', '/home'];
        
        domains.forEach(domain => {
          paths.forEach(path => {
            // Expires approach
            let cookieString = `${cookie.name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
            if (domain) {
              cookieString += `; domain=${domain}`;
            }
            document.cookie = cookieString;
            
            // Max-age approach
            cookieString = `${cookie.name}=; max-age=0; path=${path}`;
            if (domain) {
              cookieString += `; domain=${domain}`;
            }
            document.cookie = cookieString;
          });
        });
      }
    });
  }

  // Comprehensive method to clear all authentication data from all storage types
  clearAllStorage(): void {
    console.log('Starting comprehensive storage cleanup...');
    
    // Clear cookies
    this.clearAuthCookies();
    
    // Clear localStorage items
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const keysToRemove = ['souqlyUser', 'souqlyAuth'];
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`Removed localStorage item: ${key}`);
      });
    }
    
    // Clear sessionStorage items
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      const keysToRemove = ['souqlyUser', 'souqlyAuth'];
      keysToRemove.forEach(key => {
        sessionStorage.removeItem(key);
        console.log(`Removed sessionStorage item: ${key}`);
      });
    }
    
    // Force remove cookies with multiple approaches
    this.forceRemoveAllCookies();
    
    console.log('Comprehensive storage cleanup completed');
  }

  // Force remove all cookies with multiple domain and path combinations
  private forceRemoveAllCookies(): void {
    console.log('Force removing all cookies with comprehensive approach...');
    
    const cookieNames = ['souqlyAuth', 'souqlyUser'];
    const domains = ['', 'localhost', '127.0.0.1', '.localhost', '.127.0.0.1'];
    const paths = ['/', '/dashboard', '/login', '/signup', '/home', ''];
    
    cookieNames.forEach(cookieName => {
      domains.forEach(domain => {
        paths.forEach(path => {
          // Expires approach
          let cookieString = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
          if (domain) {
            cookieString += `; domain=${domain}`;
          }
          document.cookie = cookieString;
          
          // Max-age approach
          cookieString = `${cookieName}=; max-age=0; path=${path}`;
          if (domain) {
            cookieString += `; domain=${domain}`;
          }
          document.cookie = cookieString;
          
          // Empty value approach
          cookieString = `${cookieName}=; path=${path}`;
          if (domain) {
            cookieString += `; domain=${domain}`;
          }
          document.cookie = cookieString;
        });
      });
    });
    
    // Also try to clear all cookies that contain 'souqly'
    const allCookies = this.listAllCookies();
    allCookies.forEach(cookie => {
      if (cookie.name.toLowerCase().includes('souqly')) {
        console.log(`Force removing cookie: ${cookie.name}`);
        this.delete(cookie.name);
      }
    });
    
    console.log('Force removed all cookies with comprehensive approach');
  }

  // Method to list all cookies (for debugging)
  listAllCookies(): {name: string, value: string}[] {
    if (typeof document === 'undefined') return [];
    
    const cookies = document.cookie.split(';');
    const result: {name: string, value: string}[] = [];
    
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name) {
        result.push({name, value: value || ''});
      }
    }
    
    return result;
  }

  // Debug method to show all storage contents
  debugAllStorage(): void {
    console.log('=== STORAGE DEBUG INFO ===');
    
    // Cookies
    console.log('🍪 Cookies:', this.listAllCookies());
    
    // localStorage
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const localItems: {[key: string]: string} = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          localItems[key] = localStorage.getItem(key) || '';
        }
      }
      console.log('💾 localStorage:', localItems);
    }
    
    // sessionStorage
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      const sessionItems: {[key: string]: string} = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          sessionItems[key] = sessionStorage.getItem(key) || '';
        }
      }
      console.log('📦 sessionStorage:', sessionItems);
    }
    
    console.log('=== END STORAGE DEBUG ===');
  }

  // Global method for manual cookie removal (can be called from browser console)
  manualClearAllCookies(): void {
    console.log('🧹 Manual cookie removal initiated...');
    
    // Clear all souqly cookies
    this.clearAllStorage();
    
    // Additional manual removal
    const cookieNames = ['souqlyAuth', 'souqlyUser'];
    const domains = ['', 'localhost', '127.0.0.1', '.localhost', '.127.0.0.1'];
    const paths = ['/', '/dashboard', '/login', '/signup', '/home', ''];
    
    cookieNames.forEach(name => {
      domains.forEach(domain => {
        paths.forEach(path => {
          // Multiple deletion approaches
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}`;
          document.cookie = `${name}=; max-age=0; path=${path}${domain ? `; domain=${domain}` : ''}`;
          document.cookie = `${name}=; path=${path}${domain ? `; domain=${domain}` : ''}`;
        });
      });
    });
    
    console.log('✅ Manual cookie removal completed');
    console.log('Remaining cookies:', this.listAllCookies());
  }
}