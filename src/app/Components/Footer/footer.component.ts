import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  ngOnInit() {
    // Listen for theme changes if needed
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          this.handleThemeChange();
        }
      });
    });
    
    observer.observe(document.body, { attributes: true });
  }

  handleThemeChange() {
    // This method will be called when the theme changes
    // You can add any theme-specific logic here if needed
    console.log('Theme changed, footer updated accordingly');
  }
}