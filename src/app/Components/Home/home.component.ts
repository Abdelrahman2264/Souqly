import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService, Product as CartProduct } from '../../services/cart.service'; // Adjust path as needed
import { ToastrService } from 'ngx-toastr';
import { FavoritesService } from '../../services/favorites.service';
import { ActivatedRoute } from '@angular/router';


interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface Category {
  name: string;
  products: Product[];
}

interface Collection {
  title: string;
  items: Product[];
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  firstName: string = '';
  lastName: string = '';
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  collections: Collection[] = [];
  searchTerm: string = '';
  priceRange: number = 1000;
  selectedCategory: string = 'all';
  autoScrollIntervals: any[] = [];
  isLoading: boolean = true;
  selectedProduct: Product | null = null;
  showProductDetails: boolean = false;
  favorites: number[] = [];
  selectedImageIndex: number = 0;

  constructor(
    public themeService: ThemeService, 
    private http: HttpClient,
    private cartService: CartService,
    private toastr: ToastrService,
    private favoritesService: FavoritesService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get user info from localStorage
    const userData = localStorage.getItem('souqlyCurrentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.firstName = user.firstName || 'NULL';
      this.lastName = user.lastName || 'NULL';
    }

    // Subscribe to favorites changes
    this.favoritesService.favorites$.subscribe(items => {
      this.favorites = items.map(item => item.id);
    });
    this.activatedRoute.queryParams.subscribe(params => {
      const q = (params['q'] || '').trim();
      this.searchTerm = q;

      // Apply search filter after products are loaded
      if (!this.isLoading && this.searchTerm) {
        this.filterProducts();
      }
    });

    // Load products from API
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.http.get<any>('https://dummyjson.com/products/?limit=200')
      .subscribe({
        next: (data) => {
          this.processProducts(data.products);
          this.createCollections();
          this.isLoading = false;
          
          // Apply search filter after products are loaded if there's a search term
          if (this.searchTerm) {
            this.filterProducts();
          }
        },
        error: (error) => {
          console.error('Error fetching products:', error);
          this.isLoading = false;
        }
      });
  }

  processProducts(products: Product[]) {
    // Apply random discounts only to specific items (about 30% of products)
    const discountItemsCount = Math.floor(products.length * 0.3);
    const discountedIndices = this.getRandomIndices(products.length, discountItemsCount);
    
    discountedIndices.forEach(index => {
      products[index].discountPercentage = Math.floor(Math.random() * 21) + 10;
    });

    // Group products by category
    const categoriesMap = new Map<string, Product[]>();
    
    products.forEach(product => {
      if (!categoriesMap.has(product.category)) {
        categoriesMap.set(product.category, []);
      }
      categoriesMap.get(product.category)?.push(product);
    });

    // Convert to array format
    this.categories = [];
    categoriesMap.forEach((products, name) => {
      this.categories.push({ name, products });
    });

    // Set first category as default
    if (this.categories.length > 0) {
      this.filteredProducts = [...this.categories[0].products];
    }

    // Set up auto-scrolling for each category
    this.setupAutoScroll();
  }

  createCollections() {
    // Create collections based on different criteria
    this.collections = [
      {
        title: 'Best Value',
        items: [...this.getAllProducts()]
          .sort((a, b) => {
            const aPrice = a.price * (1 - ((a.discountPercentage || 0) / 100));
            const bPrice = b.price * (1 - ((b.discountPercentage || 0) / 100));
            return aPrice - bPrice;
          })
          .slice(0, 6),
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
      },
      {
        title: 'Top Rated',
        items: [...this.getAllProducts()]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 6),
        image: 'https://litcommerce.com/blog/wp-content/uploads/2023/01/best-seller-items-on-walmart-.png'
      },
      {
        title: 'Black Friday Deals',
        items: [...this.getAllProducts()]
          .filter(p => p.discountPercentage > 0)
          .sort((a, b) => b.discountPercentage - a.discountPercentage)
          .slice(0, 6),
        image: 'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
      }
    ];
  }

  getAllProducts(): Product[] {
    return this.categories.flatMap(category => category.products);
  }

  getRandomIndices(max: number, count: number): number[] {
    const indices: number[] = [];
    while (indices.length < count) {
      const randomIndex = Math.floor(Math.random() * max);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }
    return indices;
  }

  setupAutoScroll() {
    // Clear any existing intervals
    this.autoScrollIntervals.forEach(interval => clearInterval(interval));
    this.autoScrollIntervals = [];

    // Set up auto-scroll only for the "All Products" section
    if (this.selectedCategory === 'all') {
      const interval = setInterval(() => {
        this.scrollAllProducts();
      }, 1000); // Smooth continuous scrolling
      this.autoScrollIntervals.push(interval);
    }
  }

  scrollAllProducts() {
    const container = document.querySelector('.products-scroller');
    if (container) {
      container.scrollLeft += 2; // Slow continuous scroll
      
      // Reset to start if at the end
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
        setTimeout(() => {
          container.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        }, 1000);
      }
    }
  }

  scrollCategory(categoryIndex: number) {
    const container = document.getElementById(`category-${categoryIndex}`);
    if (container) {
      const scrollAmount = 320; // Slightly increased for smoother scrolling
      container.scrollLeft += scrollAmount;
      
      // Reset to start if at the end
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
        setTimeout(() => {
          container.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        }, 800);
      }
    }
  }

  // Update the scrollLeft and scrollRight methods to scroll by item width:
  scrollLeft(categoryIndex: number) {
    const container = document.getElementById(`category-${categoryIndex}`);
    if (container) {
      const scrollAmount = 280 + 24; // item width + gap
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  }

  scrollRight(categoryIndex: number) {
    const container = document.getElementById(`category-${categoryIndex}`);
    if (container) {
      const scrollAmount = 280 + 24; // item width + gap
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  filterProducts() {
    let filtered = [];
    
    if (this.selectedCategory === 'all') {
      // Flatten all products from all categories
      filtered = this.getAllProducts();
    } else {
      // Get products from selected category
      const category = this.categories.find(c => c.name === this.selectedCategory);
      filtered = category ? [...category.products] : [];
    }
    
    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(term) || 
        product.category.toLowerCase().includes(term) ||
        product.brand?.toLowerCase().includes(term)
      );
    }
    
    // Apply price filter
    filtered = filtered.filter(product => product.price <= this.priceRange);
    
    this.filteredProducts = filtered;
    this.setupAutoScroll();
  }

  addToCart(product: Product) {
    // Convert Product to CartProduct format
    const cartProduct: CartProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      discountPercentage: product.discountPercentage || 0,
      thumbnail: product.thumbnail,
      quantity: 1
    };
    
    // Use the cart service instead of localStorage directly
    this.cartService.addToCart(cartProduct);
    
    // Show confirmation using ToastrService
    this.toastr.success(`${product.title} added to cart!`, 'Success');
  }

  toggleFavorite(product: Product) {
    if (this.favorites.includes(product.id)) {
  this.favoritesService.removeFromFavorites(product.id);
      this.toastr.info(`${product.title} removed from favorites!`, 'Info');
    } else {
      this.favoritesService.addToFavorites({
        id: product.id,
        title: product.title,
        price: product.price,
        discountPercentage: product.discountPercentage,
        thumbnail: product.thumbnail
      });
      this.toastr.success(`${product.title} added to favorites!`, 'Success');
    }
  }

  isFavorite(productId: number): boolean {
    return this.favorites.includes(productId);
  }

  showProductDetail(product: Product) {
    this.selectedProduct = product;
    this.selectedImageIndex = 0; // Reset to first image
    this.showProductDetails = true;
  }

  changeMainImage(index: number) {
    this.selectedImageIndex = index;
  }

  getCurrentImage(): string {
    if (!this.selectedProduct) return '';
    return this.selectedProduct.images[this.selectedImageIndex];
  }

  closeProductDetail() {
    this.showProductDetails = false;
    this.selectedProduct = null;
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  clearSearch() {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.filterProducts();
  }

  getLowestPrice(products: Product[]): number {
    if (!products.length) return 0;
    return Math.min(...products.map(p => p.price * (1 - (p.discountPercentage || 0)/100)));
  }

  ngOnDestroy() {
    // Clear all intervals when component is destroyed
    this.autoScrollIntervals.forEach(interval => clearInterval(interval));
  }
}