import { Component, OnInit, OnDestroy, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FavoritesService, FavoriteItem } from '../../services/favorites.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FavoritesComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closeFavorites = new EventEmitter<void>();
  
  favoriteItems: FavoriteItem[] = [];
  isDarkTheme = false;
  private favoritesSubscription!: Subscription;

  constructor(
    private favoritesService: FavoritesService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Subscribe to favorites changes
    this.favoritesSubscription = this.favoritesService.favorites$.subscribe(items => {
      this.favoriteItems = items;
    });
    
    // Check for dark theme
    if (typeof document !== 'undefined') {
      this.isDarkTheme = document.documentElement.classList.contains('dark-theme');
    }
  }

  ngOnDestroy() {
    if (this.favoritesSubscription) {
      this.favoritesSubscription.unsubscribe();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event) {
    if (this.isOpen) {
      this.closeFavorites.emit();
    }
  }

  removeItem(item: FavoriteItem) {
    this.favoritesService.removeFromFavorites(item.id);
    this.toastService.show(`${item.title} removed from favorites!`, 'info');
  }

  clearFavorites() {
    if (this.favoriteItems.length === 0) return;
    
    this.favoritesService.clearFavorites();
    this.toastService.show('All favorites cleared!', 'info');
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('favorites-overlay')) {
      this.closeFavorites.emit();
    }
  }

  // Calculate discounted price
  getDiscountedPrice(price: number, discount: number): number {
    return price * (1 - discount / 100);
  }
}