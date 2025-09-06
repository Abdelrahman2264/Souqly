import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService, Product as CartProduct } from '../../services/cart.service';
import { FavoritesService } from '../../services/favorites.service';
import { FavoritesDepartmentsService } from '../../services/favorites-depatments.service';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail?: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  images: string[];
  thumbnail: string;
  reviews?: Review[];
  sku?: string;
  weight?: number;
  dimensions?: { width: number; height: number; depth: number };
  availabilityStatus?: string;
  warrantyInformation?: string;
}

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit, OnDestroy {
  name = '';
  displayName = '';
  description = '';
  isFavoriteDepartment = false;
  products: Product[] = [];
  isLoading = true;
  // Details modal state (mirrors Home component UX)
  selectedProduct: Product | null = null;
  showProductDetails = false;
  selectedImageIndex = 0;
  private routeSubscription!: Subscription;
  private favoritesSubscription!: Subscription;
  private cartSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private favoritesDepartmentsService: FavoritesDepartmentsService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    // React to param changes so navigating between categories updates without full refresh
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.name = (params.get('name') || '').toLowerCase();
      this.displayName = this.getDisplayName(this.name);
      this.description = this.getDepartmentDescription(this.name);
      this.isFavoriteDepartment = this.favoritesDepartmentsService.isFavorite(this.displayName);
      this.loadProducts();
      // Close any open product modal on navigation
      this.showProductDetails = false;
      this.selectedProduct = null;
    });

    // Subscribe to favorites changes to update button states
    this.favoritesSubscription = this.favoritesService.favorites$.subscribe(() => {
      // Trigger change detection for favorite buttons
      this.products = [...this.products];
    });

    // Subscribe to cart changes for auto-refresh
    this.cartSubscription = this.cartService.cartItems$.subscribe(() => {
      // Cart updated, trigger change detection
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.favoritesSubscription) {
      this.favoritesSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  toggleFavoriteDepartment() {
    if (this.isFavoriteDepartment) {
      this.favoritesDepartmentsService.removeFromFavorites(this.displayName);
      this.isFavoriteDepartment = false;
      this.toastService.show(`${this.displayName} removed from favorite departments!`, 'info');
    } else {
      this.favoritesDepartmentsService.addToFavorites({ name: this.displayName });
      this.isFavoriteDepartment = true;
      this.toastService.show(`${this.displayName} added to favorite departments!`, 'success');
    }
  }

  addToCart(product: Product) {
    const cartProduct: CartProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      discountPercentage: product.discountPercentage,
      thumbnail: product.thumbnail,
      quantity: 1
    };
    this.cartService.addToCart(cartProduct);
    this.toastService.show(`${product.title} added to cart!`, 'success');
  }

  addToFavorites(product: Product) {
    if (this.isFavorite(product.id)) {
      this.favoritesService.removeFromFavorites(product.id);
      this.toastService.show(`${product.title} removed from favorites!`, 'info');
    } else {
      this.favoritesService.addToFavorites({
        id: product.id,
        title: product.title,
        price: product.price,
        discountPercentage: product.discountPercentage,
        thumbnail: product.thumbnail
      });
      this.toastService.show(`${product.title} added to favorites!`, 'success');
    }
  }

  isFavorite(productId: number): boolean {
    return this.favoritesService.getFavorites().some(item => item.id === productId);
  }

  // Details modal handlers (same UX as Home)
  showProductDetail(product: Product) {
    // Prefill with current list item, then hydrate with full details (incl. reviews)
    this.selectedProduct = product;
    this.selectedImageIndex = 0;
    this.showProductDetails = true;
    this.http.get<Product>(`https://dummyjson.com/products/${product.id}`).subscribe({
      next: (full) => {
        // Merge to preserve list thumbnail/images if missing
        this.selectedProduct = { ...product, ...full };
      },
      error: () => {
        // Keep basic info if details fetch fails
      }
    });
  }

  closeProductDetail() {
    this.showProductDetails = false;
    this.selectedProduct = null;
  }

  changeMainImage(index: number) {
    this.selectedImageIndex = index;
  }

  getCurrentImage(): string {
    if (!this.selectedProduct) return '';
    return this.selectedProduct.images?.[this.selectedImageIndex] || this.selectedProduct.thumbnail;
  }

  private getDisplayName(name: string): string {
    // Convert kebab-case or lowercase to Title Case
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getFavoriteDepartments(): string[] {
    try {
      const raw = localStorage.getItem('souqlyFavoriteDepartments');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private getDepartmentDescription(name: string): string {
    const map: { [key: string]: string } = {
      electronics: 'Explore the latest gadgets, smartphones, and accessories.',
      fashion: 'Trendy apparel, shoes, and accessories for all styles.',
      'home & kitchen': 'Essentials and décor for your home and kitchen.',
      beauty: 'Skincare, makeup, and personal care products.',
      sports: 'Gear and apparel for your favorite sports and activities.',
      books: 'Bestsellers, classics, and educational books for all ages.',
      toys: 'Fun and educational toys for kids of all ages.',
      automotive: 'Car accessories, tools, and maintenance essentials.',
      groceries: 'Daily essentials and pantry items delivered to you.',
      jewelry: 'Elegant jewelry and watches for every occasion.'
    };
    return map[name] || 'Discover curated products in this department.';
  }

  private loadProducts() {
    this.isLoading = true;
    // Use category endpoint for efficiency
    this.http.get<any>(`https://dummyjson.com/products/category/${encodeURIComponent(this.name)}`).subscribe({
      next: (res) => {
        this.products = (res?.products || []) as Product[];
        this.isLoading = false;
      },
      error: () => {
        this.products = [];
        this.isLoading = false;
      }
    });
  }
}


