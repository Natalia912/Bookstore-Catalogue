# Book Catalogue App

A small Next.js-based book catalogue application for browsing a collection of books and discovering basic information such as title, author, language, price, quantity, cover, and ISBN.

Production link: [https://bookstore-catalogue.tretiakowa2212.workers.dev/](https://bookstore-catalogue.tretiakowa2212.workers.dev/)

## Project Purpose

The goal of this project is to provide a minimal, user-friendly catalogue where visitors can quickly search and filter the available book collection. The public-facing side should present a clean list/grid of books with enough metadata to help a reader decide what to explore.

The app is intentionally scoped to a small catalogue use case:

- Public users can browse the catalogue without authentication.
- Users can search by title and author.
- Users can narrow results by language and price range.
- The catalogue is designed to display a minimal set of book information instead of a full commerce experience.

The admin side supports operational tasks for the catalogue data:

- Manage current book catalogue (edit/delete) with search and filter options for quicker book identification.
- Add new books or edit existing books manually through a form.
- Quick new book form fill with ISBN search.

## Current Features

The current app is a minimal catalogue with a user view and a lightweight admin entry point:

- Responsive book grid/list UI.
- Search input that filters catalogue results.
- Language filter and price range filter controls.
- Price bound fetching for correctly sized filter UI.
- Form-based add-book workflow using React Hook Form and Zod validation.
- Supabase-backed data access layer with Next.js server-side integration.

## Tech Stack

This project is built with:

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS and shadcn/ui
- Supabase for data storage/access
- Cloudflare/OpenNext deployment support
- ESLint, Prettier and Wrangler configuration

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the app.

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run format
npm run preview
npm run deploy
```

## Roadmap

Near-term priorities for this project include:

1. Completing the admin CRUD flow for create, read, update and delete of catalogue records.
2. Adding a proper ISBN search workflow with optional external enrichment.
