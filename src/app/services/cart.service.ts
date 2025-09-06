// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';

// Export the interface so it can be imported in other components
export interface CartItem {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
  quantity: number;
}
export interface Product {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
  quantity: number;

}
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private userService: UserService) {
    this.loadCartItems();
    
    // Listen for storage events from other tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key && event.key.startsWith('souqlyCart_')) {
          this.loadCartItems();
        }
      });
    }

    // Listen for user changes
    this.userService.currentUser$.subscribe(() => {
      this.loadCartItems();
    });
  }

  private getCartKey(): string {
    const userId = this.userService.getCurrentUserId();
    return userId ? `souqlyCart_${userId}` : 'souqlyCart_guest';
  }

  loadCartItems() {
    if (typeof localStorage !== 'undefined') {
      const cartKey = this.getCartKey();
      const cartData = localStorage.getItem(cartKey);
      if (cartData) {
        try {
          const items = JSON.parse(cartData);
          this.cartItemsSubject.next(items);
        } catch (e) {
          console.error('Error parsing cart data:', e);
          this.cartItemsSubject.next([]);
        }
      } else {
        this.cartItemsSubject.next([]);
      }
    }
  }

  saveCartItems(items: CartItem[]) {
    if (typeof localStorage !== 'undefined') {
      const cartKey = this.getCartKey();
      localStorage.setItem(cartKey, JSON.stringify(items));
      this.cartItemsSubject.next(items);
    }
  }

  addToCart(product: Product) {
    const cartItem: CartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      discountPercentage: product.discountPercentage,
      thumbnail: product.thumbnail,
      quantity: 1
    };
    
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(i => i.id === product.id);
    
    if (existingItemIndex > -1) {
      // Item exists, update quantity
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += 1;
      this.saveCartItems(updatedItems);
    } else {
      // New item, add to cart
      this.saveCartItems([...currentItems, cartItem]);
    }
    
    return cartItem; // Return the added/updated item if needed
  }

  updateQuantity(itemId: number, quantity: number) {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.map(item => 
      item.id === itemId ? {...item, quantity} : item
    ).filter(item => item.quantity > 0); // Remove if quantity becomes 0
    
    this.saveCartItems(updatedItems);
  }

  removeFromCart(itemId: number) {
    const updatedItems = this.cartItemsSubject.value.filter(item => item.id !== itemId);
    this.saveCartItems(updatedItems);
  }

  clearCart() {
    this.saveCartItems([]);
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  getTotalItems(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  // Method to transfer guest cart to user cart when logging in
  transferGuestCartToUser(userId: string) {
    const guestCartKey = 'souqlyCart_guest';
    const userCartKey = `souqlyCart_${userId}`;
    
    if (typeof localStorage !== 'undefined') {
      const guestCartData = localStorage.getItem(guestCartKey);
      if (guestCartData) {
        try {
          const guestItems = JSON.parse(guestCartData);
          const userCartData = localStorage.getItem(userCartKey);
          let userItems: CartItem[] = [];
          
          if (userCartData) {
            userItems = JSON.parse(userCartData);
          }
          
          // Merge guest cart with user cart, avoiding duplicates
          guestItems.forEach((guestItem: CartItem) => {
            const existingItemIndex = userItems.findIndex(item => item.id === guestItem.id);
            if (existingItemIndex > -1) {
              userItems[existingItemIndex].quantity += guestItem.quantity;
            } else {
              userItems.push(guestItem);
            }
          });
          
          // Save merged cart to user
          localStorage.setItem(userCartKey, JSON.stringify(userItems));
          
          // Clear guest cart
          localStorage.removeItem(guestCartKey);
          
          // Reload cart items
          this.loadCartItems();
        } catch (e) {
          console.error('Error transferring guest cart:', e);
        }
      }
    }
  }
}