import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: any[] = [];
  private toastContainer: HTMLElement | null = null;

  constructor() {
    this.initializeToastContainer();
  }

  private initializeToastContainer() {
    if (typeof document !== 'undefined') {
      // Create toast container if it doesn't exist
      this.toastContainer = document.getElementById('toast-container');
      
      if (!this.toastContainer) {
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'toast-container';
        this.toastContainer.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 10px;
        `;
        document.body.appendChild(this.toastContainer);
      }
    }
  }

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success', duration: number = 3000) {
    if (typeof document === 'undefined') return;

    this.initializeToastContainer();
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Set toast content and styles
    toast.innerHTML = `
      <div class="toast-content">
        <i class="toast-icon ${this.getIconForType(type)}"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    // Apply styles
    toast.style.cssText = `
      min-width: 300px;
      background: ${this.getBackgroundColor(type)};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: toastSlideIn 0.3s ease forwards;
      opacity: 0;
      transform: translateX(100px);
    `;

    // Add toast to container
    if (this.toastContainer) {
      this.toastContainer.appendChild(toast);
      
      // Animate in
      setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
      }, 10);
      
      // Auto remove after duration
      const timeoutId = setTimeout(() => {
        this.removeToast(toast);
      }, duration);
      
      // Store toast reference
      this.toasts.push({ element: toast, timeoutId });
      
      // Add close button functionality
      const closeBtn = toast.querySelector('.toast-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          clearTimeout(timeoutId);
          this.removeToast(toast);
        });
      }
    }
  }

  private removeToast(toast: HTMLElement) {
    toast.style.animation = 'toastSlideOut 0.3s ease forwards';
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
      
      // Remove from toasts array
      this.toasts = this.toasts.filter(t => t.element !== toast);
    }, 300);
  }

  private getIconForType(type: string): string {
    switch (type) {
      case 'success': return 'fas fa-check-circle';
      case 'error': return 'fas fa-exclamation-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'info': return 'fas fa-info-circle';
      default: return 'fas fa-info-circle';
    }
  }

  private getBackgroundColor(type: string): string {
    switch (type) {
      case 'success': return 'var(--success-color, #28a745)';
      case 'error': return 'var(--danger-color, #dc3545)';
      case 'warning': return 'var(--warning-color, #ffc107)';
      case 'info': return 'var(--info-color, #17a2b8)';
      default: return 'var(--info-color, #17a2b8)';
    }
  }

  // Clear all toasts
  clearAll() {
    this.toasts.forEach(toast => {
      clearTimeout(toast.timeoutId);
      this.removeToast(toast.element);
    });
    this.toasts = [];
  }
}