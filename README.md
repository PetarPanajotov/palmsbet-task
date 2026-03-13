# Casino Interview Task

A casino game lobby built with Next.js 15 as a frontend interview task. It loads game data from an external CDN, supports search and
provider filtering, and has support for multiple languages using `next-intl`.

## Live Demo

[https://palmsbet-task.vercel.app/en/](https://palmsbet-task.vercel.app/en/)

## Overview

This project is a casino game lobby page that includes:

- loading games from an external source
- filtering by provider
- search with debounce and URL sync
- responsive game grid
- loading, empty, and error states
- reusable game cards
- loading more games as you scroll
- English and Bulgarian translations
- unit tests for hooks
- error boundary
- Framer Motion animations

## Tech Stack

- Next.js 15 App Router
- TypeScript
- SWR
- Tailwind CSS
- next-intl
- Vitest
- React Testing Library
- Framer Motion
- Lucide Icons

## Getting Started

### Requirements

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/PetarPanajotov/palmsbet-task.git
cd palmsbet-task
npm install
npm run dev
```

Open the app at `http://localhost:3000/en/`.

## Design Notes

Figma was used as a reference for layout and design. The final result follows the design closely, but some breakpoints were adjusted using
Tailwind utilities since the Figma breakpoints were meant as guidelines, not strict rules.

## What Was Built

### Core Requirements

- ✅ Load games from external CDN
- ✅ Filter by provider and search term
- ✅ SWR caching and revalidation
- ✅ External API response mapped to internal `Game` interface
- ✅ Loading and error states
- ✅ Responsive page layout
- ✅ Empty state when no results found
- ✅ Retry button on fetch error
- ✅ `next-intl` integration
- ✅ Reusable `GameCard` component
- ✅ Lazy-loaded images

### Extra Features

- ✅ Provider filter with horizontal scroll
- ✅ Debounced search input
- ✅ Search term saved in URL
- ✅ Load more games as you scroll
- ✅ Unit tests for hooks
- ✅ Framer Motion animations
- ✅ Error boundary
- ✅ Scroll-to-top button _(added on own initiative)_

### Not Built

- ❌ Virtualized list with `react-window` — replaced with incremental loading, which fits better with the page scroll design.

## Features in Detail

### 1. Games Data Hook

**File:** `hooks/useGames.ts`

- loads games from the CDN
- uses SWR for caching
- maps the API response to the internal `Game` shape
- normalizes image URLs based on the image path clarification provided by email
- supports filtering by provider and search term
- returns loading and error states
- exposes `mutate()` for retry

**Data source:** `https://cdn.palmsbet.com/static/games_bg.json`

### 2. Main Page

**File:** `app/[locale]/page.tsx`

- shows loading skeletons while data loads
- shows empty state when no games match the filters
- shows a reset button when there are no results
- shows a retry button on error
- renders a responsive game grid
- loads more games as the user scrolls
- has a scroll-to-top button
- uses `next-intl` for translations

### 3. Game Card

**File:** `components/GameCard/GameCard.tsx`

- shows game image
- shows details as name, provider, lines, volatility, buttons `Play` & `Demo` _(on hover)_
- lazy loads images
- shows a fallback if the image fails to load
- has entrance and hover animations via Framer Motion

### 4. Provider Filter

**File:** `components/ProviderFilter/ProviderFilter.tsx`

- scrollable list of provider chips
- click to select or deselect a provider
- drag to scroll
- shows or hides arrows based on scroll position
- has a loading skeleton state

### 5. Search Input

**File:** `components/SearchInput/SearchInput.tsx`

- has a search icon and a clear button
- input is debounced
- value is synced with the URL

### 6. URL Search Param Hook

**File:** `hooks/useSearchQueryParam.ts`

- reads the current value from the URL
- updates the URL without reloading the page
- trims whitespace before saving
- removes the param when the value is empty
- keeps other params unchanged

### 7. Incremental Pagination

**File:** `hooks/usePaginatedGames.ts`

- loads games in small batches
- uses intersecton observer to detect when to load more
- resets when filters change
- uses transitionm to keep the UI smooth

### 8. Scroll To Top

**File:** `hooks/useScrollToTop.ts`

- shows a button after the user scrolls down
- clicking it scrolls smoothly back to the top

### 9. Error Boundary

**File:** `app/[locale]/error.tsx`

- catches unexpected errors during rendering
- separate from API error handling
- has a retry button

## Performance

Some steps were taken to keep the app fast:

- `useMemo` and `useCallback` where useful
- `GameCard` is memoized _(Based on tests, improved the performance by a lot)_
- search input is debounced
- SWR handles caching
- images are lazy loaded with `next/image`
- games are loaded in batches instead of all at once

### Why No Virtualization

`react-window` was not used because the page uses the main document scroll. Adding a separate scroll container would break the layout and
feel wrong. Incremental loading was a better fit in my opinion.

## Tests

Unit tests were written with **Vitest** and **React Testing Library**.

### `useGames`

- loading state
- successful fetch and mapping
- filtering by provider and search
- error handling
- image URL transfformation
- mutate/revalidation

### `useSearchQueryParam`

- reading params from the URL
- setting, updating, and removing params
- trimming whitespace
- keeping unrelated params
- scroll behavior

## Translations

The app supports two languages using `next-intl`:

- English — `messages/en.json`
- Bulgarian — `messages/bg.json`

## Available Scripts

- `dev` — start development server
- `build` — build for production
- `start` — start production server
- `lint` — run ESLint
- `type-check` — run TypeScript compiler
- `format` — format with Prettier
- `format:check` — check formatting
- `test` — run Vitest
- `test:watch` — run Vitest in watch mode
- `test:run` — run tests once

## Project Structure

```txt
casino-interview-template/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── error.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── GameCard/
│   │   ├── GameCard.tsx
│   │   ├── GameCardSkeleton.tsx
│   │   └── index.ts
│   ├── ProviderFilter/
│   │   ├── ProviderFilter.tsx
│   │   ├── ProviderFilterSkeleton.tsx
│   │   └── index.ts
│   ├── SearchInput/
│   │   ├── SearchInput.tsx
│   │   └── index.ts
│   └── LanguageSwitcher/
│       ├── LanguageSwitcher.tsx
│       └── index.ts
├── hooks/
│   ├── useGames.ts
│   ├── useGames.test.ts
│   ├── useHorizontalDragScroll.ts
│   ├── usePaginatedGames.ts
│   ├── useScrollToTop.ts
│   ├── useSearchQueryParam.test.ts
│   └── useSearchQueryParam.ts
├── lib/
│   └── utils.ts
├── types/
│   └── game.ts
├── messages/
│   ├── en.json
│   └── bg.json
├── i18n/
│   ├── request.ts
│   └── routing.ts
└── README.md
```

## Notes

The goal was to write clean, simple code that works well and is easy to read.

Some components like `GameCard` and `app/[locale]/page.tsx` could be split into smaller pieces. However, since the task scope is limited and
the goal was to keep things simple, it made more sense to keep related logic together in one place.
