import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';

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
      const currentuser = localStorage.getItem('souqlyCurrentUser')
      const id = currentuser ? JSON.parse(currentuser).id : null;
      const cartData = localStorage.getItem('souqlyCart_' + id);
      if (cartData) {
        this.cartItems = JSON.parse(cartData);
      }
    }
  }

  saveCartItems() {
    if (typeof localStorage !== 'undefined') {
      const currentuser = localStorage.getItem('souqlyCurrentUser')
      const id = currentuser ? JSON.parse(currentuser).id : null;
      localStorage.setItem('souqlyCart_'+id, JSON.stringify(this.cartItems));
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
    
    // Generate and download PDF invoice
    this.generateInvoice();
    
    // Show success message
    alert(`Order placed successfully! Total: $${this.totalPrice.toFixed(2)}`);
    this.clearCart();
    this.closeCart.emit();
  }

  generateInvoice() {
    const doc = new jsPDF();
    
    // Get customer information from localStorage if available
    let customerName = 'Customer Name';
    let customerAddress = 'Customer Address';
    let customerCity = 'City, Country';
    
    if (typeof localStorage !== 'undefined') {
      const userData = localStorage.getItem('souqlyUser');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          customerName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Customer Name';
          customerAddress = user.address || 'Customer Address';
          customerCity = user.city || 'City, Country';
        } catch (e) {
          console.log('Could not parse user data');
        }
      }
    }
    
    // Company Information Header with Logo
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Company Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('SOUQLY', 105, 25, { align: 'center' });
    
    // Company Tagline
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Online Marketplace', 105, 35, { align: 'center' });
    
    // Company Details Section
    doc.setFillColor(248, 249, 250);
    doc.rect(0, 40, 210, 30, 'F');
    
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(10);
    doc.text('Tax Number: 123456789', 20, 55);
    doc.text('Commercial Register: CR123456789', 20, 62);
    doc.text('Email: info@souqly.com', 20, 69);
    
    doc.text('Phone: +966-50-123-4567', 150, 55);
    doc.text('Address: Riyadh, Saudi Arabia', 150, 62);
    doc.text('Website: www.souqly.com', 150, 69);
    
    // Invoice Header
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 70, 210, 30, 'F');
    
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 105, 85, { align: 'center' });
    
    // Invoice Details
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const invoiceNumber = 'INV-' + Date.now();
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${currentDate}`, 20, 100);
    doc.text(`Invoice #: ${invoiceNumber}`, 20, 107);
    doc.text(`Payment Method: Credit Card`, 20, 114);
    
    // Customer Information
    doc.text('Bill To:', 150, 100);
    doc.text(customerName, 150, 107);
    doc.text(customerAddress, 150, 114);
    doc.text(customerCity, 150, 121);
    
    // Items Table
    const tableY = 130;
    
    // Table Header
    doc.setFillColor(102, 126, 234);
    doc.rect(20, tableY, 170, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Item Description', 25, tableY + 8);
    doc.text('Price', 110, tableY + 8);
    doc.text('Qty', 140, tableY + 8);
    doc.text('Total', 170, tableY + 8);
    
    // Table Content
    let yPosition = tableY + 20;
    doc.setTextColor(44, 62, 80);
    doc.setFont('helvetica', 'normal');
    
    this.cartItems.forEach((item, index) => {
      // Alternating row colors
      if (index % 2 === 0) {
        doc.setFillColor(248, 249, 250);
        doc.rect(20, yPosition - 8, 170, 12, 'F');
      }
      
      // Item details
      doc.text(item.title.substring(0, 35), 25, yPosition);
      doc.text(`$${item.price.toFixed(2)}`, 110, yPosition);
      doc.text(item.quantity.toString(), 140, yPosition);
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 170, yPosition);
      
      yPosition += 12;
    });
    
    // Total Section
    doc.setFillColor(255, 255, 255);
    doc.rect(20, yPosition + 5, 170, 25, 'F');
    
    doc.line(20, yPosition + 5, 190, yPosition + 5);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', 140, yPosition + 20);
    doc.text(`$${this.totalPrice.toFixed(2)}`, 170, yPosition + 20);
    
    // Tax calculation (assuming 15% VAT for Saudi Arabia)
    const taxAmount = this.totalPrice * 0.15;
    doc.text('VAT (15%):', 140, yPosition + 30);
    doc.text(`$${taxAmount.toFixed(2)}`, 170, yPosition + 30);
    
    doc.line(140, yPosition + 35, 190, yPosition + 35);
    doc.setFontSize(14);
    doc.text('Total Amount:', 140, yPosition + 45);
    doc.text(`$${(this.totalPrice + taxAmount).toFixed(2)}`, 170, yPosition + 45);
    
    // Return and Exchange Policy
    const policyY = yPosition + 60;
    doc.setFillColor(248, 249, 250);
    doc.rect(20, policyY, 170, 40, 'F');
    
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Return & Exchange Policy', 25, policyY + 8);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('• Exchange Policy: 14 days from purchase date', 25, policyY + 18);
    doc.text('• Return Policy: 3 days from purchase date', 25, policyY + 25);
    doc.text('• Products must be in original condition with all packaging', 25, policyY + 32);
    doc.text('• Contact customer service for return/exchange requests', 25, policyY + 39);
    
    // Footer
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 270, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Thank you for shopping with Souqly!', 105, 280, { align: 'center' });
    doc.text('For support, contact us at support@souqly.com', 105, 287, { align: 'center' });
    doc.text('© 2024 Souqly. All rights reserved.', 105, 294, { align: 'center' });
    
    // Save the PDF
    doc.save(`souqly-invoice-${invoiceNumber}.pdf`);
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('cart-overlay')) {
      this.closeCart.emit();
    }
  }
}