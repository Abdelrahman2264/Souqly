import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CartComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeCart = new EventEmitter<void>();
  
  cartItems: CartItem[] = [];
  totalPrice = 0;
  isDarkTheme = false;

  ngOnInit() {
    this.loadCartItems();
    this.calculateTotal();
    
    // Check for dark theme
    if (typeof document !== 'undefined') {
      this.isDarkTheme = document.documentElement.classList.contains('dark-theme');
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event) {
    if (this.isOpen) {
      this.closeCart.emit();
    }
  }

  loadCartItems() {
    if (typeof localStorage !== 'undefined') {
      const cartData = localStorage.getItem('souqlyCart');
      if (cartData) {
        this.cartItems = JSON.parse(cartData);
      }
    }
  }

  saveCartItems() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('souqlyCart', JSON.stringify(this.cartItems));
    }
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  increaseQuantity(item: CartItem) {
    item.quantity++;
    this.saveCartItems();
    this.calculateTotal();
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
      this.saveCartItems();
      this.calculateTotal();
    }
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.saveCartItems();
    this.calculateTotal();
  }

  clearCart() {
    this.cartItems = [];
    this.saveCartItems();
    this.calculateTotal();
  }

  checkout() {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    alert(`Order placed successfully! Total: $${this.totalPrice.toFixed(2)}`);
    this.clearCart();
    this.closeCart.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('cart-overlay')) {
      this.closeCart.emit();
    }
  }
}