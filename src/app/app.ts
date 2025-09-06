import { Component } from '@angular/core';
import { HeaderComponent } from './Components/Header/header.component';
import { FooterComponent } from './Components/Footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true,
 
  imports: [HeaderComponent, RouterModule, FooterComponent]  
})
export class App {
  title = 'Souqly';
}
