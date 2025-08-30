import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from '../../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isDarkTheme: boolean = false;
  submitted = false;
  
  // Contact information
  contactInfo = {
    email: 'souqly.support@gmail.com',
    phone: '+20 12 079-678-12',
    fiberPhone: '+03 332-563',
    location: 'Egypt ,Alex ,Smouha,Azbt-Saad,Faculty of Computer and Data Science',
    hours: 'Saturday - Thuseday: 9:00 AM - 5:00 PM\nSaturday: 11:00 AM - 5:00 PM'
  };

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      phone: ['']
    });
  }

  ngOnInit(): void {
    // Set initial theme state
    this.isDarkTheme = this.themeService.isDarkTheme();
    
    // Subscribe to theme changes
    this.themeService.themeChanged.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.contactForm.valid) {
      // In a real application, you would send the form data to your backend here
      console.log('Form submitted:', this.contactForm.value);
      
      // Simulate API call
      setTimeout(() => {
        alert('Thank you for your message! We will get back to you soon.');
        this.contactForm.reset();
        this.submitted = false;
      }, 1000);
    }
  }

  // Helper method to check if a field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!field && field.invalid && (field.touched || this.submitted);
  }
}