import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { CommonModule } from '@angular/common';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  imports: [CommonModule]
})
export class FaqComponent implements OnInit {
  faqItems: FaqItem[] = [];
  filteredFaqItems: FaqItem[] = [];
  isDarkTheme: boolean = false;
  activeCategory: string = 'all';
  
  categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'account', name: 'Account & Registration' },
    { id: 'ordering', name: 'Ordering & Payment' },
    { id: 'shipping', name: 'Shipping & Delivery' },
    { id: 'returns', name: 'Returns & Refunds' },
    { id: 'security', name: 'Security & Privacy' }
  ];

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Set initial theme state
    this.isDarkTheme = this.themeService.isDarkTheme();
    
    // Subscribe to theme changes
    this.themeService.themeChanged.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
    
    this.loadFaqItems();
    this.filteredFaqItems = [...this.faqItems];
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleFaqItem(item: FaqItem): void {
    item.isOpen = !item.isOpen;
  }

  filterByCategory(categoryId: string): void {
    this.activeCategory = categoryId;
    
    if (categoryId === 'all') {
      this.filteredFaqItems = [...this.faqItems];
    } else {
      this.filteredFaqItems = this.faqItems.filter(item => item.category === categoryId);
    }
  }

  loadFaqItems(): void {
    this.faqItems = [
      {
        question: 'What is Souqly?',
        answer: 'Souqly is a comprehensive e-commerce platform that connects buyers and sellers across the Middle East. We provide a secure, user-friendly marketplace for purchasing everything from electronics to fashion, home goods, and more.',
        category: 'account',
        isOpen: false
      },
      {
        question: 'How do I create an account on Souqly?',
        answer: 'To create an account, click on the "Sign Up" button at the top right of any page. You\'ll need to provide your email address, create a password, and verify your email. Alternatively, you can sign up using your Google or Facebook account for faster registration.',
        category: 'account',
        isOpen: false
      },
      {
        question: 'I forgot my password. How can I reset it?',
        answer: 'Click on the "Forgot Password" link on the login page. Enter your registered email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.',
        category: 'account',
        isOpen: false
      },
      {
        question: 'How do I place an order on Souqly?',
        answer: 'After finding a product you want to purchase, select the desired quantity and click "Add to Cart." When you\'re ready to complete your purchase, go to your cart and click "Proceed to Checkout." You\'ll need to provide shipping information, select a payment method, and confirm your order.',
        category: 'ordering',
        isOpen: false
      },
      {
        question: 'What payment methods does Souqly accept?',
        answer: 'Souqly accepts various payment methods including credit/debit cards (Visa, MasterCard, American Express), digital wallets (Apple Pay, Google Pay), cash on delivery (available in select areas), and bank transfers.',
        category: 'ordering',
        isOpen: false
      },
      {
        question: 'Is it safe to use my credit card on Souqly?',
        answer: 'Yes, Souqly uses industry-standard SSL encryption to protect your payment information. We do not store your complete credit card details on our servers, and all transactions are processed through secure payment gateways.',
        category: 'security',
        isOpen: false
      },
      {
        question: 'How long does delivery take?',
        answer: 'Delivery times vary depending on your location and the seller\'s location. Typically, orders are delivered within 2-5 business days within major cities, and 5-10 business days to other areas. You can see estimated delivery times during checkout and in your order confirmation.',
        category: 'shipping',
        isOpen: false
      },
      {
        question: 'What are Souqly\'s shipping options?',
        answer: 'We offer several shipping options including standard shipping (3-7 business days), express shipping (1-3 business days), and same-day delivery (available in select metropolitan areas). Shipping costs vary based on the option selected and the size/weight of your order.',
        category: 'shipping',
        isOpen: false
      },
      {
        question: 'How can I track my order?',
        answer: 'Once your order has been shipped, you\'ll receive a confirmation email with a tracking number. You can also track your order by logging into your Souqly account, going to "My Orders," and selecting the order you want to track.',
        category: 'shipping',
        isOpen: false
      },
      {
        question: 'What is Souqly\'s return policy?',
        answer: 'We offer a 14-day return policy for most items. Items must be unused, in their original packaging, and with all tags attached. Some products like perishable goods, personalized items, and intimate apparel may not be eligible for return. Please check the product page for specific return eligibility.',
        category: 'returns',
        isOpen: false
      },
      {
        question: 'How do I return a product?',
        answer: 'To initiate a return, go to "My Orders" in your account, select the item you want to return, and click "Return Item." Follow the prompts to select a return reason and print your return label. Once we receive and inspect the returned item, we\'ll process your refund within 5-7 business days.',
        category: 'returns',
        isOpen: false
      },
      {
        question: 'How long does it take to process a refund?',
        answer: 'Refunds are typically processed within 5-7 business days after we receive and inspect the returned item. The time it takes for the refund to appear in your account depends on your payment method and financial institution.',
        category: 'returns',
        isOpen: false
      },
      {
        question: 'How does Souqly protect my personal information?',
        answer: 'Souqly takes data privacy seriously. We comply with international data protection regulations and use advanced security measures to protect your information. We never sell your personal data to third parties. You can review our complete Privacy Policy in the website footer.',
        category: 'security',
        isOpen: false
      },
      {
        question: 'Can I sell products on Souqly?',
        answer: 'Yes! Souqly offers a seller program that allows businesses and individuals to sell products on our platform. To get started, visit our Seller Center and follow the registration process. You\'ll need to provide some business information and verification documents.',
        category: 'account',
        isOpen: false
      },
      {
        question: 'How do I contact Souqly customer service?',
        answer: 'You can reach our customer service team through multiple channels: 1) Live chat available on our website (9 AM - 11 PM local time), 2) Email at support@souqly.com, or 3) Phone at +1 (555) 123-HELP. Response times vary by channel, with live chat typically being the fastest.',
        category: 'account',
        isOpen: false
      }
    ];
  }
}