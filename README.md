# Casino Interview Template

A Next.js 15 template project for frontend developer interviews focused on building a casino game lobby.

## Project Overview

This is a starter template for a casino game lobby interview task. Candidates will build a functional game listing page with search and
filtering functionality.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone or fork this repository
git clone <repository-url>
cd casino-interview-template

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000/en/
```

## Interview Task

### Objective

Build a fully functional casino game lobby page with the following features.

---

## Design

**Figma:** [Design File](https://www.figma.com/design/ouEOtlfXEf3e2r5LG4NfSW/TASK?node-id=0-1&p=f&t=f5Qhflgq2OOUoG2Q-0)

> **Note:** The design is for reference only.

---

## Task Requirements

### 1. Custom Hooks

#### `hooks/useGames.ts`

- Fetch games from external CDN
- Support filtering by provider and search term
- Use SWR for caching and revalidation
- Transform external API response to app's Game interface
- Return loading and error states

### 2. Main Casino Page

**File:** `app/[locale]/page.tsx`

Implement the casino page that:

- Uses all components above
- Shows loading state while fetching
- Shows empty state when no games match
- Handles errors gracefully with retry button
- Implements a responsive games grid (refer to Figma for layout and breakpoints)
- Integrates with next-intl for translations

### 3. Game Card Component

**File:** `components/GameCard/GameCard.tsx`

Implement a reusable `GameCard` component that:

- Displays game image and name
- Shows game info: lines and volatility
- Shows "Play" and "Demo" buttons (buttons are non-functional)
- Add lazy loading for game images

---

## Data Source

Games are fetched from: `https://cdn.palmsbet.com/static/games_bg.json`

### Game Data Structure

Each game from the API contains the following fields:

| Field        | Type   | Description                                      |
| ------------ | ------ | ------------------------------------------------ |
| `id`         | number | Unique game identifier                           |
| `name`       | string | Game display name                                |
| `provider`   | string | Game provider/vendor code (e.g., "CTRGSECASINO") |
| `image`      | string | Full URL to game image                           |
| `lines`      | string | Number of paylines (e.g., "50", "20", "100")     |
| `volatility` | string | Game volatility level                            |

---

## Technical Requirements

### Must Use:

- ✅ Next.js 15 App Router
- ✅ TypeScript (strict mode enabled)
- ✅ SWR for data fetching
- ✅ Tailwind CSS for styling
- ✅ next-intl for translations

### Code Quality Expectations:

- Proper TypeScript interfaces/types throughout
- Component composition over inheritance
- Custom hooks for reusable logic
- Error boundaries (optional but bonus)
- Loading states and skeletons (optional but bonus)
- Responsive design
- Clean, readable code with consistent style

### Performance Considerations:

- Memoization with useMemo/useCallback where beneficial
- Debounced search input
- Image optimization with Next.js Image
- Efficient re-renders

---

## Project Structure

```
casino-interview-template/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx              # TODO: Main casino page
│   │   └── layout.tsx            # i18n layout
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│   └── page.tsx                  # Root page (redirects to default locale)
├── components/
│   ├── GameCard/
│   │   ├── GameCard.tsx          # TODO: Game card
│   │   └── index.ts
│   ├── ProviderFilter/
│   │   ├── ProviderFilter.tsx    # BONUS: Provider filter
│   │   └── index.ts
│   ├── SearchInput/
│   │   ├── SearchInput.tsx       # BONUS: Search input
│   │   └── index.ts
│   └── LanguageSwitcher/
│       ├── LanguageSwitcher.tsx  # Language switcher
│       └── index.ts
├── hooks/
│   └── useGames.ts               # Games data hook
├── lib/
│   └── utils.ts                  # Utility functions
├── types/
│   └── game.ts                   # TypeScript types
├── messages/
│   ├── en.json                   # English translations
│   └── bg.json                   # Bulgarian translations
├── i18n/
│   ├── request.ts                # i18n request config
│   └── routing.ts                # i18n routing config
└── README.md                     # This file
```

---

## Bonus Points (Optional)

- ✅ Provider Filter Component (`components/ProviderFilter/ProviderFilter.tsx`) — horizontal scrollable chips, single-select toggle
- ✅ Search Input Component (`components/SearchInput/SearchInput.tsx`) — search icon, debounced input (300ms), clear button
- ✅ Pagination for the game grid
- ✅ Unit tests for hooks (React Testing Library)
- ✅ Virtualized list for large datasets (react-window)
- ✅ Advanced animations (Framer Motion)
- ✅ Error boundary implementation
- ✅ URL search params persistence

---

## Tips for Candidates

1. **Start with data fetching** - Get games loading first
2. **Build one component at a time** - Don't try to do everything at once
3. **Test as you go** - Check browser frequently
4. **Prioritize requirements** - Focus on core functionality first
5. **Use TypeScript** - Proper types show attention to detail
6. **Don't over-engineer** - Simple, working code is better than complex incomplete code
7. **Ask questions** - If something is unclear, ask!

---

## Common Pitfalls to Avoid

❌ Not handling loading states  
❌ Missing error handling  
❌ Not using TypeScript properly (using `any`)  
❌ Over-fetching data (not using SWR caching)  
❌ Not debouncing search input  
❌ Non-responsive design  
❌ Over-complicating simple features

---

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler
- `npm run format` - Auto-format all files with Prettier
- `npm run format:check` - Check formatting (CI-friendly)

---

## Questions?

If you have questions during the interview, don't hesitate to ask!

Good luck! 🎰
