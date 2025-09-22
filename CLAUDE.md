# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start dev server**: `ng serve` or `npm start` - runs on http://localhost:4200/
- **Build**: `ng build` or `npm run build` - outputs to `dist/foodstall-calculator/`
- **Build for development**: `npm run watch` - builds with watch mode and development configuration
- **Run tests**: `ng test` or `npm test` - executes unit tests via Karma
- **Generate components**: `ng generate component component-name` (also works for directive, pipe, service, class, guard, interface, enum, module)

## Architecture

This is an Angular 18 application using:
- **Standalone components** architecture (no NgModules)
- **SCSS** for styling (configured as default)
- **Angular CLI** build system
- **Karma + Jasmine** for testing
- **TypeScript 5.5**

### Project Structure
- `src/app/` - Main application code
  - `app.component.*` - Root component
  - `app.config.ts` - Application configuration with providers
  - `app.routes.ts` - Routing configuration
- `src/main.ts` - Application bootstrap
- `src/styles.scss` - Global styles
- `public/` - Static assets

### Key Configuration
- Uses `bootstrapApplication()` with standalone components
- Component prefix: `app`
- Style language: SCSS
- TypeScript configuration split across `tsconfig.app.json` and `tsconfig.spec.json`
- Build budgets: 500kB warning, 1MB error for initial bundle; 2kB warning, 4kB error for component styles