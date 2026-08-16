# Project Code Instructions & Development Standards

These rules are mandatory for all code generated, modified, or reviewed in this project.
Follow them consistently when creating new features, fixing bugs, refactoring code, or adding new modules.

---

## 1. Configuration, Constants, Hard-Coded Values & Messages

- Never hard-code configurable, reusable, or domain-specific values directly inside business logic.
- Move all reusable hard-coded values into appropriate `const` files or configuration files and reuse them throughout the application.
- Never hard-code application messages directly inside business logic.
- All application messages must be centralized in appropriate message/constant files and reused throughout the application.
- This includes, but is not limited to:
  - Success messages
  - Error messages
  - Validation messages
  - Authentication/authorization messages
  - API response messages
  - Database-related messages
  - User/account messages
  - File upload/download messages
  - Notification messages
  - Email/SMS messages
  - Permission/access-denied messages
  - Business-rule messages
  - Warning and informational messages
- Keep messages organized by domain/module instead of creating one unnecessarily large global messages file.
- Use descriptive and meaningful constant names for all constants and messages.
- Avoid magic strings and magic numbers in business logic.
- Examples of values that should be extracted into constants include:
  - Status values
  - Roles and permissions
  - API paths/endpoints
  - Application messages
  - Pagination defaults
  - Validation limits
  - Timeouts and retry limits
  - Regular expressions
  - File size/type limits
  - Database-related constants
  - Business rules and numeric thresholds
  - Feature flags
  - Default values
- If a value is environment-specific, deployment-specific, or expected to change between environments, store it in environment variables instead of a `const` file.
- Create and maintain a `.env.example` file containing every required environment variable, using placeholder values only.
- Never commit real secrets, API keys, passwords, tokens, connection strings, or other credentials.
- Configuration values should be centralized in configuration modules rather than accessing `process.env` throughout business logic.
- Business logic should consume constants, messages, and configuration values instead of directly containing magic strings, magic numbers, or environment-specific values.
- Constants should be immutable and use `const` wherever applicable.
- Organize constants and messages by domain/module. For example:
  - `constants/auth.constants.ts`
  - `constants/user.constants.ts`
  - `constants/api.constants.ts`
  - `constants/validation.constants.ts`
  - `constants/database.constants.ts`
  - `constants/pagination.constants.ts`
  - `messages/auth.messages.ts`
  - `messages/user.messages.ts`
  - `messages/api.messages.ts`
  - `messages/validation.messages.ts`
- Do not create a single huge `constants.ts` or `messages.ts` file containing unrelated application-wide values.
- Do not extract genuinely one-time local implementation details into constants when doing so provides no reuse, clarity, or maintainability benefit.

---

## 2. File Size & Code Complexity

- Maximum file length: **300 lines**.
- Maximum line length: **120 characters**.
- Maximum column length **120characters**
- If a file approaches the 300-line limit, refactor it before adding more code.
- Split large components, services, controllers, utilities, and configuration files into smaller focused modules.
- Avoid deeply nested logic and unnecessarily complex functions.
- Prefer small, single-purpose functions.

---

## 3. DRY — Don't Repeat Yourself

- Never duplicate code when the same logic can be reused.
- Extract repeated logic into:
  - Reusable components
  - Helper functions
  - Utility functions
  - Services
  - Hooks
  - Middleware
  - Shared types
- Before creating new functionality, check whether an existing reusable implementation already exists.
- Extend or reuse existing functionality instead of creating duplicate implementations.

---

## 4. Reusable Components & Modules

- Components should have a **single responsibility**.
- Create reusable components for UI patterns that appear more than once.
- Avoid creating large components that handle unrelated responsibilities.
- Shared functionality should be placed in appropriate reusable modules.
- Avoid unnecessary abstraction; create abstractions when they provide real reuse or separation of responsibility.

---

## 5. Helper Files

- Helper/utility files must not exceed **300 lines**.
- Group helpers by responsibility/domain.
- Do not create one massive `helpers.ts` or `utils.ts` file containing unrelated functionality.
- Use an `index` file/barrel file where appropriate to simplify imports.

```text
helpers/
├── date.helper.ts
├── validation.helper.ts
├── string.helper.ts
└── index.ts
```

---

## 6. Service Layer Architecture

- Never access database models directly from controllers, routes, or other presentation-layer code.
- All database/business operations must go through a service layer.
- Create a reusable `BaseService` for common CRUD/database operations where appropriate.
- Domain-specific services must extend `BaseService`.

```text
BaseService
    ↓
UserService
    ↓
UserController
```

Structure:
```text
services/
├── base.service.ts
├── user.service.ts
├── auth.service.ts
└── index.ts
```

---

## 7. Separation of Responsibilities

Follow a clear separation between:
- Routes
- Controllers
- Services
- Models
- Repositories/data-access logic, when required
- Middleware
- Validators
- Helpers
- Utilities
- Types/interfaces
- Configuration
- Constants

Avoid putting business logic inside routes or controllers.

---

## 8. Type Safety

- Always use proper types.
- Avoid `any` unless there is a strong technical reason.
- Prefer explicit interfaces, types, generics, unions, and enums where appropriate.
- Type function parameters and return values.
- Type API request/response structures.
- Type service methods and database-related operations.
- Keep shared types in dedicated type files/modules.

---

## 9. Comments & Documentation

Every file must contain a brief comment describing:
- What the file is responsible for.
- Why it exists when its purpose is not obvious.
- How it should be used when appropriate.

Comments should explain **why**, not unnecessarily explain obvious code.

---

## 10. Environment Configuration

Always create `.env.example` containing every environment variable required by the application.
- Never commit `.env`.
- Never expose secrets in source code.
- Validate required environment variables when the application starts.
- Centralize environment/configuration access.

---

## 11. Import Aliases

- Use configured import aliases instead of long relative import paths (e.g., `@/services/user.service`).
- Configure aliases consistently across TypeScript, runtime, build tools, test configuration, and linters.

---

## 12. Styling

- Avoid inline styles.
- Use the project's established styling solution.
- Keep styling separate from business logic.
- Reuse shared styling components/tokens where appropriate.

---

## 13. Validation & Error Handling

- Validate external input at application boundaries.
- Use centralized validation where possible.
- Use consistent error handling without exposing sensitive internal errors to clients.

---

## 14. API Standards

- Consistent HTTP status codes & response structures.
- Thin controllers with business logic inside services.
- Typed request/response structures.

---

## 15. Database Access

- Access DB through services/repositories, not controllers.
- Validate & sanitize data before persistence.
- Handle database errors consistently.

---

## 16. Authentication & Authorization

- Keep authentication logic in dedicated services/middleware.
- Never hardcode secrets.
- Use reusable middleware/guards for protected routes.

---

## 17. Folder Structure

### Backend
```text
src/
├── config/
├── constants/
├── controllers/
├── helpers/
├── middleware/
├── models/
├── routes/
├── services/
│   ├── base.service.ts
│   ├── user.service.ts
│   └── index.ts
├── types/
├── validators/
├── utils/
├── app.ts
└── server.ts
```

### Frontend
```text
src/
├── components/
├── constants/
├── hooks/
├── layouts/
├── pages/
├── services/
├── store/
├── types/
├── utils/
├── validators/
├── assets/
└── main.tsx
```

---

## 18. Index / Barrel Files

Use `index.ts` files to simplify imports when useful.
Do not create barrel files that introduce circular dependencies.

---

## 19. Naming Conventions

- Components & Classes: `PascalCase`
- Functions & Variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Types/Interfaces: `PascalCase`
- Descriptive names (avoid `data`, `temp`, `thing`, `helper`).

---

## 20. Async & Error-Safe Code

- Prefer `async/await`.
- Never silently swallow errors.
- Ensure promises are properly awaited or intentionally handled.

---

## 21. Logging

- Centralized logging mechanism instead of random `console.log()`.
- Never log passwords, tokens, API keys, or sensitive info.

---

## 22. Security

- Input validation, parameterized DB queries, authentication/authorization.
- Secure password handling, CORS, rate limiting.

---

## 23. Dependencies

- Avoid unnecessary packages.
- Prefer actively maintained libraries compatible with stack.

---

## 24. Testing

- Include unit, integration, API, or component tests for business logic.
- Follow the same type-safety and file-size rules for test files.

---

## 25. Git & Code Quality

Before completion:
- Remove unused imports/vars/debug code.
- Run formatting, linting, type checks, and tests.
- Review diff and check for exposed secrets.

---

## 26. Refactoring Rule

- Fix obvious architectural problems when touching code.
- Avoid technical debt.

---

## 27. New Project Initialization

1. Define architecture & folder structure first.
2. Configure TypeScript, import aliases, env variables, `.env.example`, constants, types, base abstractions.
3. Set up linting, formatting, testing, error handling, logging, validation, and service architecture.
4. Implement features incrementally.

---

## 28. Before Writing New Code

1. Inspect existing structure.
2. Identify reusable components/services/helpers/constants/types.
3. Determine architectural placement before creating files.

---

## 29. When Adding a New Feature

- Follow architecture, add types/validation/services/constants/tests/docs.
- Keep components/controllers thin.

---

## 30. AI Code Generation Rules

- Follow all conventions above strictly.
- Max 300 lines/file, 120 chars/line.
- Use import aliases, services, proper types, externalized config, comments.

---

## 31. Definition of Done

A feature is complete when architecture, typing, limits, validation, tests, security,
linting, and formatting criteria are satisfied.

---

## Core Principle

> **Write code that is clean, typed, reusable, secure, testable, maintainable,**
> **and scalable — not merely code that works.**