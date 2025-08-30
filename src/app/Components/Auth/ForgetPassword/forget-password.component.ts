import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  email = '';
  otpInput: string = '';
  private generatedOtp: string | null = null;
  step: 'request' | 'verify' | 'done' = 'request';
  isLoading: boolean = false;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'error';

  // Update this with your .NET API endpoint
  private apiBaseUrl = 'https://localhost:7008/api/email';

  constructor(
    private http: HttpClient,
    private router: Router
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

  /** Send OTP via email */
  async sendReset(form: NgForm) {
    if (!form.valid) {
      this.showToastMessage('Please enter a valid email');
      return;
    }

    const re = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!re.test(this.email)) {
      this.showToastMessage('Invalid email format');
      return;
    }

    // Generate OTP
    this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    this.isLoading = true;

    try {
      // Prepare email request for your .NET API
      const emailRequest = {
        recipientEmail: this.email,
        subject: 'Password Reset OTP',
        title: 'Password Reset Request',
        mainMessage: `You have requested to reset your password. Please use the following OTP to verify your identity:`,
        verificationCode: this.generatedOtp,
        footerMessage: 'If you did not request this password reset, please ignore this email.',
        isVerificationEmail: true
      };

      // Send request to your .NET API
      const response: any = await this.http.post(`${this.apiBaseUrl}/send`, emailRequest).toPromise();
      
      if (response && response.success) {
        this.showToastMessage('OTP sent to your email ✅', 'success');
        this.step = 'verify';
      } else {
        this.showToastMessage('Failed to send OTP. Please try again later.');
      }
    } catch (error) {
      console.error('API Error:', error);
      this.showToastMessage('Failed to send OTP. Please try again later.');
    } finally {
      this.isLoading = false;
    }
  }

  /** Verify OTP */
  verifyOtp() {
    if (!this.otpInput || !this.generatedOtp) {
      this.showToastMessage('Please request OTP and enter it');
      return;
    }

    if (this.otpInput === this.generatedOtp) {
      this.showToastMessage('OTP verified. You can now reset your password 🎉', 'success');
      this.step = 'done';
    } else {
      this.showToastMessage('Invalid OTP ❌');
    }
  }

  /** Reset the flow */
  resetFlow() {
    this.email = '';
    this.otpInput = '';
    this.generatedOtp = null;
    this.step = 'request';
    this.isLoading = false;
  }
}