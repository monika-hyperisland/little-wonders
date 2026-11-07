
# Little Wonders – AI Agent Instructions

## Project Overview

Little Wonders is a responsive web application where users can
save and manage meaningful memories about pets, plants,
adventures, and creative projects.

## Architecture

- Use a client-server architecture.
- Build the frontend with HTML, CSS, and vanilla JavaScript.
- Use Node.js, npm, and Vite for development and builds.
- Use Bootstrap 5 for responsive layouts and UI components.
- Use Supabase as the backend for authentication, database,
  and file storage.
- Communicate with Supabase through the official JavaScript
  client, which uses Supabase APIs.
- Use multi-page navigation with a separate HTML file for
  each page.
- Keep code modular and avoid large, monolithic files.

## Project Structure

- HTML pages belong in the project root.
- Page-specific JavaScript belongs in `src/pages/`.
- Shared services and Supabase configuration belong in `src/lib/`.
- Shared styles belong in `src/css/`.
- Images and other static assets belong in `src/assets/`.

## Authentication and Security

- Use Supabase Auth for registration, login, and logout.
- Protect private application data with Row Level Security (RLS).
- Ensure users can access only their own private records.
- Never expose secret keys or service-role keys in frontend code.
- Keep environment variables in `.env.local`.
- Never commit `.env.local` or credentials to GitHub.

## Code Quality

- Use clear, descriptive names for variables and functions.
- Prefer small, reusable functions and modules.
- Handle asynchronous operations with `async` and `await`.
- Show helpful error messages to users.
- Validate form input before sending requests.
- Maintain accessible and responsive UI components.
- Avoid unused code and unnecessary dependencies.

## Development Workflow

- Implement features in small, testable steps.
- Run `npm run build` after meaningful changes.
- Test authentication and data operations in the browser.
- Make descriptive Git commits for completed features.
- Keep the GitHub repository updated.
- Follow all requirements in the SoftUni capstone assignment.
