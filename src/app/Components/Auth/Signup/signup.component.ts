import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    gender: '',
    dob: '',
    password: ''
  };
  
  confirmPassword = '';
  showToast = false;
  toastMessage = '';
  toastType = 'success';
  
  countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
    'France', 'Japan', 'Brazil', 'India', 'China', 'Mexico', 'Italy',
    'Spain', 'South Africa', 'Nigeria', 'Egypt', 'Kenya', 'Ghana'
  ];

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Check for saved theme preference
    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    document.body.classList.toggle('dark-theme', isDarkTheme);
    
    // Set the toggle state
    const toggle = document.getElementById('theme-toggle') as HTMLInputElement;
    if (toggle) {
      toggle.checked = isDarkTheme;
    }
  }

  toggleTheme(isDark: boolean) {
    document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem('darkTheme', isDark.toString());
  }

  private showToastMessage(message: string, type: 'success' | 'error' = 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  private validEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return re.test(email);
  }

  private validPassword(pw: string): boolean {
    const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return re.test(pw);
  }
  
  private validPhone(phone: string): boolean {
    const re = /^[+]?[1-9][\d]{0,15}$/;
    return re.test(phone);
  }
  
  private calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      this.showToastMessage('Please fill all required fields correctly');
      return;
    }
    
    if (!this.user.firstName || !this.user.lastName) {
      this.showToastMessage('Please enter your first and last name');
      return;
    }
    
    if (!this.validEmail(this.user.email)) {
      this.showToastMessage('Invalid email format');
      return;
    }
    
    if (!this.validPhone(this.user.phone)) {
      this.showToastMessage('Please enter a valid phone number');
      return;
    }
    
    if (!this.user.country || !this.user.city) {
      this.showToastMessage('Please select your country and city');
      return;
    }
    
    if (!this.user.gender) {
      this.showToastMessage('Please select your gender');
      return;
    }
    
    if (!this.user.dob) {
      this.showToastMessage('Please enter your date of birth');
      return;
    }
    
    const age = this.calculateAge(this.user.dob);
    if (age < 13) {
      this.showToastMessage('You must be at least 13 years old to register');
      return;
    }
    
    if (!this.validPassword(this.user.password)) {
      this.showToastMessage('Password must be 8+ chars, include uppercase, number, and special char');
      return;
    }
    
    if (this.user.password !== this.confirmPassword) {
      this.showToastMessage('Passwords do not match');
      return;
    }

    try {
      // Use the user service to register the user
      const newUser = this.userService.registerUser(this.user);
      this.showToastMessage('Account created successfully! Your unique ID is: ' + newUser.id, 'success');
      
      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 2000);
    } catch (error: any) {
      this.showToastMessage(error.message || 'Registration failed. Please try again.');
    }
  }
}