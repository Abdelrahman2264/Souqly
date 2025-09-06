# Souqly

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.5.

## Authentication & Logout

The application uses a comprehensive authentication system that stores user data across multiple storage types:

### Storage Types Used
- **Cookies**: `souqlyAuth` and `souqlyUser` for session persistence
- **localStorage**: User data and authentication status
- **sessionStorage**: Session-specific authentication data

### Logout Functionality
The logout process (`HeaderComponent.logout()`) performs a comprehensive cleanup:

1. **Clears all cookies** using multiple domain/path combinations
2. **Removes localStorage items** (`souqlyUser`, `souqlyAuth`)
3. **Clears sessionStorage items** (`souqlyUser`, `souqlyAuth`)
4. **Verifies cleanup** with detailed console logging
5. **Redirects to home page** and reloads for clean state

### Debug Features
- Use `CookieService.debugAllStorage()` to view all storage contents
- Console logging shows detailed verification of storage cleanup
- Comprehensive error handling for different storage scenarios

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
