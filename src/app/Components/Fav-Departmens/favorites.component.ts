// favorites.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FavoritesDepartmentsService, FavoriteDepartment } from '../../services/favorites-depatments.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-favorites-dep',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FavoritesDepComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closeFavorites = new EventEmitter<void>();

  favoriteDepartments: FavoriteDepartment[] = [];
  isDarkTheme = false;
  private favoritesSubscription!: Subscription;

  constructor(
    private favoritesService: FavoritesDepartmentsService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    // Subscribe to favorites changes
    this.favoritesSubscription = this.favoritesService.favorites$.subscribe(departments => {
      this.favoriteDepartments = departments;
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

  removeDepartment(department: FavoriteDepartment) {
    this.favoritesService.removeFromFavorites(department.name);
    this.toastService.show(`${department.name} removed from favorites!`, 'info');
  }

  clearFavorites() {
    if (this.favoriteDepartments.length === 0) return;

    this.favoritesService.clearFavorites();
    this.toastService.show('All favorite departments cleared!', 'info');
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('favorites-overlay')) {
      this.closeFavorites.emit();
    }
  }
}