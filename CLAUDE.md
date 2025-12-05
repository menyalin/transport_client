# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Язык общения: Русский, комментарии в коде на русском языке

## Development Commands

This is a Vue.js 2 application using Vue CLI.

- **Install dependencies**: `npm install`
- **Development server**: `npm run serve` (starts hot-reload development server)
- **Production build**: `npm run build` (compiles and minifies for production)
- **Lint code**: `npm run lint` (runs ESLint to lint and fix files)

## Architecture Overview

### Technology Stack

- **Frontend**: Vue.js 2.7 with Vue Router and Vuex
- **UI Framework**: Vuetify 2.6 (Material Design components)
- **Form Validation**: Vuelidate 2.x
- **Date Handling**: Day.js with Russian locale
- **State Management**: Vuex with modular store structure
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client
- **Document Generation**: docxtemplater for Word documents

### Project Structure

The codebase follows a modular architecture with clear separation of concerns:

#### Core Directories

- `src/main.js` - Application entry point with global plugin setup
- `src/router/` - Modular route definitions split by feature areas
- `src/store/` - Vuex store modules organized by business domains
- `src/shared/` - Reusable components, services, and utilities
- `src/entities/` - Business entity logic and components
- `src/features/` - Feature-specific functionality
- `src/modules/` - Major application modules (auth, accounting, common, etc.)
- `src/pages/` - Page-level components organized by feature area

#### Key Architecture Patterns

**Modular Store Structure**: The Vuex store is split into modules:

- `AuthModule` - Authentication state and logic
- `ProfileModule` - Profile-related data management
- `OrderModule` - Order management state
- `AccountingModule` - Accounting functionality state

**Route Organization**: Routes are split by business domain:

- `profile/` - Management pages for various entities (companies, drivers, trucks, etc.)
- `accounting/` - Financial and accounting features
- `orders/` - Order management and scheduling
- `auth/` - Authentication flows

**Service Layer**: Business logic is abstracted into services in `src/shared/services/`:

- Each entity has its own service (e.g., `order.service.js`, `driver.service.js`)
- Centralized API communication patterns
- Consistent error handling and data transformation

**Component Organization**:

- `shared/ui/` - Reusable UI components (forms, buttons, layout components)
- `entities/` - Entity-specific components and business logic
- `features/` - Feature-specific components that may span multiple entities

### Business Domain

This is a transportation/logistics management system (s4log) that handles:

- Order management and scheduling
- Driver and vehicle management
- Route planning and tracking
- Financial management (payments, invoices, tariffs)
- Document management and reporting
- Partner and company management

### State Management Patterns

The application uses Vuex with:

- Centralized loading states (`loading`, `appLoading`)
- Error handling with commit patterns
- Temporary cache map for form state persistence
- Permission-based access control integrated with routing

### Form Handling

- Vuelidate for form validation
- Custom hooks for persisted form state
- Consistent form wrapper components
- File upload handling with progress tracking

### Development Environment

The application connects to a backend API running on `localhost:3040` during development, with endpoints for API, WebSocket connections, and static file serving.

### Key Dependencies

- `@vuelidate/core` & `@vuelidate/validators` - Form validation
- `axios` - HTTP requests
- `dayjs` - Date manipulation
- `docxtemplater` - Word document generation
- `socket.io-client` - Real-time communication
- `vuedraggable` - Drag and drop functionality
- `uuid` - Unique identifier generation
- `zod` - Schema validation
