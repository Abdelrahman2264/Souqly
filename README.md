# 🛒 Souqly - Modern E-Commerce Platform

Souqly is a modern Angular-based e-commerce system that provides a complete shopping experience with authentication, responsive design, cart management, and theme switching. It is designed to be user-friendly, mobile-first, and highly customizable.

## 📑 Table of Contents
- Features
- Pages
- Modals
- Authentication System
- Themes & Styles
- UI/UX Guidelines
- Tech Stack
- Development
- Project Status
- Support

## ⚙️ Features
- 🛍️ Add To Cart / Remove From Cart  
- 🔍 Product Filter & Search  
- 💸 Sale & Discount system  
- 🎨 Theme Switcher (White / Dark)  
- 📱 Fully Responsive (Desktop, Tablet, Mobile)  
- 📊 Canvas Graphs (for Dashboard & Analytics)  
- 📑 Export Data (Excel, PDF)  
- 💳 Payment Gateway Integration (MasterCard – Coming Soon)  
- 👨‍👩‍👧‍👦 Meet Our Team (About section)  
- 🔔 Toast Notifications (Success / Error)  
- 🍪 Cookie-based Authorizations  
- ✅ Regex Validations for forms  

## 🖥️ Pages
- Login – User authentication page  
- Sign Up – User registration  
- Forget Password – Password recovery  
- Dashboard – Admin/User dashboard for quick insights  
- Home – Landing page with highlighted products  
- All Product – Browse all available products  
- Category Page – Category-based product filtering  
- Profile – User profile page  
- Edit User Data – Update user profile & personal info  
- Contact Us – Contact form with company details  
- Support – Customer support center  
- About Us – Company/team details  
- Privacy – Privacy and security policies  

## 🪟 Modals
- Cart Modal – View items before checkout  
- Add To Cart Modal – Quick add to cart confirmation  
- Delete Modal – Confirmation before removing items  
- Verification Modal – Email/OTP verification  

## 🔐 Authentication & Logout
The application uses a comprehensive authentication system that stores user data across multiple storage types.

**Storage Types Used:**
- Cookies: souqlyAuth and souqlyUser for session persistence  
- localStorage: User data and authentication status  
- sessionStorage: Session-specific authentication data  

**Logout Functionality**
- Clears all cookies using multiple domain/path combinations  
- Removes localStorage items (souqlyUser, souqlyAuth)  
- Clears sessionStorage items (souqlyUser, souqlyAuth)  
- Redirects to home page and reloads for clean state  

**Debug Features**
- `CookieService.debugAllStorage()` to view all storage contents  
- Console logging for detailed verification  

## 🎨 Themes & Styles
**White Theme**
- Primary Color: Blue  
- Text: Black on White background  
- Navigation: White/Gray navbar  
- Buttons: Primary, Danger, Warning, Success, Secondary  

**Dark Theme**
- Primary Color: Info (blue shade)  
- Text: White on Black background  
- Navigation: Dark Gray navbar  
- Buttons: Primary, Danger, Warning, Success, Secondary  

## 🖌️ UI/UX Guidelines
- Typography: Clear and readable (Roboto / Open Sans)  
- Layout: Grid-based design with spacing  
- Rounded corners (12px), soft shadows, hover effects  
- Smooth animations for theme switch & modals  
- Responsive with Flexbox/Grid  

## 🛠️ Tech Stack
- **Frontend Framework:** Angular 20.1.5  
- **Styling:** CSS3, Flexbox, Grid  
- **Icons:** Font Awesome, Bootstrap Icons, Google Icons  
- **Authentication:** Cookies, localStorage, sessionStorage  
- **Build Tool:** Angular CLI  

## 🚀 Development
**Run Development Server**
```bash
ng serve
```
Visit [http://localhost:4200](http://localhost:4200).

**Generate Component**
```bash
ng generate component component-name
```

**Build Project**
```bash
ng build
```

**Run Tests**
```bash
ng test
```

**Run End-to-End Tests**
```bash
ng e2e
```

## 📌 Project Status
✅ Pages Complete  
✅ Features Implemented  
✅ White & Dark Themes Available  
🔄 Payment Gateway – Coming Soon  

**Next Improvements:**
- Wishlist & favorites  
- Live chat support  
- Order tracking system  
- Enhanced analytics  
- Payment gateway integration  

## 📞 Support
For support, contact the development team or check the documentation.
