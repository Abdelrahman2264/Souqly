import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

interface Product {
  id: number;
  name: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  image: string;
  category: string;
  rating: number;
}

interface OfferSection {
  title: string;
  category: string;
  products: Product[];
}

interface Voucher {
  id: number;
  amount: number;
  price: number;
  discount: number;
  description: string;
}

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {
  offers: OfferSection[] = [];
  vouchers: Voucher[] = [];
  isDarkTheme: boolean = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Set initial theme state
    this.isDarkTheme = this.themeService.isDarkTheme();
    
    // Subscribe to theme changes
    this.themeService.themeChanged.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
    
    this.loadOffers();
    this.loadVouchers();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  loadOffers(): void {
    this.offers = [
      {
        title: 'Fashion Deals',
        category: 'fashion',
        products: [
          {
            id: 1,
            name: 'Summer Floral Dress',
            originalPrice: 89.99,
            discountPrice: 59.99,
            discountPercentage: 33,
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'fashion',
            rating: 4.5
          },
          {
            id: 2,
            name: 'Men\'s Casual Shirt',
            originalPrice: 45.99,
            discountPrice: 29.99,
            discountPercentage: 35,
            image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'fashion',
            rating: 4.2
          },
          {
            id: 3,
            name: 'Designer Sunglasses',
            originalPrice: 120.00,
            discountPrice: 79.99,
            discountPercentage: 33,
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'fashion',
            rating: 4.7
          },
          {
            id: 4,
            name: 'Sports Running Shoes',
            originalPrice: 99.99,
            discountPrice: 69.99,
            discountPercentage: 30,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'fashion',
            rating: 4.4
          }
        ]
      },
      {
        title: 'Grocery Specials',
        category: 'grocery',
        products: [
          {
            id: 5,
            name: 'Organic Coffee Blend',
            originalPrice: 14.99,
            discountPrice: 9.99,
            discountPercentage: 33,
            image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'grocery',
            rating: 4.3
          },
          {
            id: 6,
            name: 'Extra Virgin Olive Oil',
            originalPrice: 19.99,
            discountPrice: 14.99,
            discountPercentage: 25,
            image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'grocery',
            rating: 4.6
          },
          {
            id: 7,
            name: 'Organic Honey Jar',
            originalPrice: 12.99,
            discountPrice: 8.99,
            discountPercentage: 31,
            image: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'grocery',
            rating: 4.8
          }
        ]
      },
      {
        title: 'Luxury Watches',
        category: 'watches',
        products: [
          {
            id: 8,
            name: 'Classic Leather Watch',
            originalPrice: 199.99,
            discountPrice: 149.99,
            discountPercentage: 25,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'watches',
            rating: 4.9
          },
          {
            id: 9,
            name: 'Smart Fitness Watch',
            originalPrice: 179.99,
            discountPrice: 129.99,
            discountPercentage: 28,
            image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'watches',
            rating: 4.5
          },
          {
            id: 10,
            name: 'Gold Luxury Watch',
            originalPrice: 349.99,
            discountPrice: 279.99,
            discountPercentage: 20,
            image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'watches',
            rating: 4.7
          }
        ]
      },
      {
        title: 'Electronics Devices',
        category: 'electronics',
        products: [
          {
            id: 11,
            name: 'Wireless Headphones',
            originalPrice: 129.99,
            discountPrice: 89.99,
            discountPercentage: 31,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'electronics',
            rating: 4.6
          },
          {
            id: 12,
            name: 'Smartphone X Pro',
            originalPrice: 899.99,
            discountPrice: 749.99,
            discountPercentage: 17,
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'electronics',
            rating: 4.8
          },
          {
            id: 13,
            name: 'Bluetooth Speaker',
            originalPrice: 79.99,
            discountPrice: 59.99,
            discountPercentage: 25,
            image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'electronics',
            rating: 4.4
          },
          {
            id: 14,
            name: 'Gaming Mouse',
            originalPrice: 69.99,
            discountPrice: 49.99,
            discountPercentage: 29,
            image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'electronics',
            rating: 4.3
          }
        ]
      },
      {
        title: 'Home Furniture',
        category: 'furniture',
        products: [
          {
            id: 15,
            name: 'Modern Sofa Set',
            originalPrice: 1299.99,
            discountPrice: 999.99,
            discountPercentage: 23,
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'furniture',
            rating: 4.7
          },
          {
            id: 16,
            name: 'Wooden Dining Table',
            originalPrice: 599.99,
            discountPrice: 449.99,
            discountPercentage: 25,
            image: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'furniture',
            rating: 4.6
          },
          {
            id: 17,
            name: 'Comfy Office Chair',
            originalPrice: 199.99,
            discountPrice: 149.99,
            discountPercentage: 25,
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'furniture',
            rating: 4.5
          }
        ]
      },
      {
        title: 'Beauty Products',
        category: 'beauty',
        products: [
          {
            id: 18,
            name: 'Luxury Skincare Set',
            originalPrice: 89.99,
            discountPrice: 64.99,
            discountPercentage: 28,
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'beauty',
            rating: 4.8
          },
          {
            id: 19,
            name: 'Perfume Collection',
            originalPrice: 129.99,
            discountPrice: 99.99,
            discountPercentage: 23,
            image: 'https://waxlondon.com/cdn/shop/files/Fragrance-Web-Banner.jpg?v=1730124757',
            category: 'beauty',
            rating: 4.7
          },
          {
            id: 20,
            name: 'Makeup Brush Set',
            originalPrice: 49.99,
            discountPrice: 34.99,
            discountPercentage: 30,
            image: 'https://images.unsplash.com/photo-1617897903246-719242758050?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'beauty',
            rating: 4.4
          }
        ]
      },
      {
        title: 'Sports Equipment',
        category: 'sports',
        products: [
          {
            id: 21,
            name: 'Yoga Mat Premium',
            originalPrice: 39.99,
            discountPrice: 29.99,
            discountPercentage: 25,
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'sports',
            rating: 4.6
          },
          {
            id: 22,
            name: 'Dumbbell Set 20kg',
            originalPrice: 89.99,
            discountPrice: 69.99,
            discountPercentage: 22,
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'sports',
            rating: 4.5
          },
          {
            id: 23,
            name: 'Running Shoes',
            originalPrice: 119.99,
            discountPrice: 89.99,
            discountPercentage: 25,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'sports',
            rating: 4.7
          }
        ]
      },
      {
        title: 'Books & Stationery',
        category: 'books',
        products: [
          {
            id: 24,
            name: 'Bestseller Novel Pack',
            originalPrice: 59.99,
            discountPrice: 39.99,
            discountPercentage: 33,
            image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'books',
            rating: 4.8
          },
          {
            id: 25,
            name: 'Premium Notebook Set',
            originalPrice: 29.99,
            discountPrice: 19.99,
            discountPercentage: 33,
            image: 'https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'books',
            rating: 4.4
          },
          {
            id: 26,
            name: 'Art Supplies Kit',
            originalPrice: 49.99,
            discountPrice: 34.99,
            discountPercentage: 30,
            image: 'https://images-na.ssl-images-amazon.com/images/I/81K6Xqy9jVL._UL1200_.jpg',
            category: 'books',
            rating: 4.6
          }
        ]
      },
      {
        title: 'Toys & Games',
        category: 'toys',
        products: [
          {
            id: 27,
            name: 'Building Blocks Set',
            originalPrice: 49.99,
            discountPrice: 34.99,
            discountPercentage: 30,
            image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            category: 'toys',
            rating: 4.7
          },
          {
            id: 28,
            name: 'Educational Board Game',
            originalPrice: 39.99,
            discountPrice: 29.99,
            discountPercentage: 25,
            image: 'https://www.giftoo.in/cdn/shop/products/main-image-1_8218916e-f539-4e9a-b5db-5b35cb3678e3.webp?v=1710521452',
            category: 'toys',
            rating: 4.5
          },
          {
            id: 29,
            name: 'Remote Control Car',
            originalPrice: 69.99,
            discountPrice: 49.99,
            discountPercentage: 29,
            image: 'https://static-01.daraz.pk/p/22922b4a0e7a510666f9784ffd650502.jpg',
            category: 'toys',
            rating: 4.3
          }
        ]
      }
    ];
  }

  loadVouchers(): void {
    this.vouchers = [
      {
        id: 1,
        amount: 500,
        price: 450,
        discount: 10,
        description: 'Perfect for everyday shopping'
      },
      {
        id: 2,
        amount: 1000,
        price: 850,
        discount: 15,
        description: 'Great value for frequent shoppers'
      },
      {
        id: 3,
        amount: 2000,
        price: 1700,
        discount: 15,
        description: 'Ideal for family shopping'
      },
      {
        id: 4,
        amount: 3000,
        price: 2550,
        discount: 15,
        description: 'Premium shopping experience'
      },
      {
        id: 5,
        amount: 5000,
        price: 4250,
        discount: 15,
        description: 'For serious shoppers'
      },
      {
        id: 6,
        amount: 10000,
        price: 8500,
        discount: 15,
        description: 'Ultimate shopping power'
      }
    ];
  }
}