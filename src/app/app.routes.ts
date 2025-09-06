import { Routes } from '@angular/router';
import { LoginComponent } from './Components/Auth/Login/login.component';
import { SignupComponent } from './Components/Auth/Signup/signup.component';
import { ForgetPasswordComponent } from './Components/Auth/ForgetPassword/forget-password.component';

import {ResetPasswordComponent} from './Components/Auth/reset-password/reset-password.component'
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './Components/Home/home.component';
import { DepartmentComponent } from './Components/Departments/department.component';
import { ProfileComponent } from './Components/User/Profile/profile.component';
import { DashboardComponent } from './Components/Dashboard/dashboard.component';
import { AboutComponent } from './Components/Team_Service/About/about.component';
import { ContactComponent } from './Components/Team_Service/Contact-Us/contact.component';
import { FaqComponent } from './Components/Team_Service/FAQs/faq.component';
import { DealsComponent } from './Components/Deals/deals.component';
import { PrivacyComponent } from './Components/Team_Service/Privacy/privacy.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'Home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'departments/:name', component: DepartmentComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'deals', component: DealsComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];
