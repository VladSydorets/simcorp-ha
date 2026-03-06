# SimCorp News

A news coverage application built for SimCorp's Customer & Commercial Insights team. Allows customer success managers and sales people to track news coverage for their accounts.

## Features

- **Account sidebar** — browse all accounts with mention counts, filter by type (Customer/Prospect) and industry, search by name
- **Recent News** — focused view of the latest articles from the last 30 days per account
- **Browse All** — full article history with total article count and pagination
- **Article detail** — full article text with optional mention highlighting overlay button
- **Account profile** — stats overview (total articles, recent mentions)
- **Smooth animations** — elegant transitions when toggling highlights and navigating
- **Responsive design** — works seamlessly across desktop and mobile devices

## Key Interactions

- Click on any account in the sidebar to filter news for that account
- Navigate to "Recent News" to see articles from the last 30 days
- Navigate to "All Articles" to browse the complete article history
- Use the "Highlight Mentions" button on article detail pages to toggle account mention highlighting
- Click account mention badges to jump to that account's profile

## Tech Stack

- **Vue 3** (Composition API)
- **Pinia** — state management with computed properties for filtering and pagination
- **Vue Router** — client-side routing with named views and params
- **TypeScript** — type-safe data handling
- **Tailwind CSS** — utility-first styling with smooth transitions
- **Vite** — fast build tooling and dev server

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the application at `http://localhost:5173`

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

## Project Structure

```
src/
├── components/
│   ├── articles/
│   │   ├── ArticleCard.vue         # Individual article preview
│   │   ├── ArticleDetail.vue       # Full article with highlighting toggle
│   │   └── ArticleList.vue         # List container with pagination
│   └── layout/
│       ├── AppHeader.vue           # Navigation header
│       └── AppSidebar.vue          # Account browser sidebar
├── views/
│   ├── HomeView.vue                # Recent news view
│   ├── AllArticlesView.vue         # All articles view
│   ├── ArticleView.vue             # Article detail page
│   └── AccountView.vue             # Account profile page
├── stores/
│   └── news.ts                     # Pinia store with filtering logic
├── router/
│   └── index.ts                    # Vue Router configuration
├── composables/
│   └── useNewsData.ts              # Data loading composable
├── types/
│   └── index.ts                    # TypeScript interfaces
└── main.ts                         # App entry point

data/
├── accounts.json                   # Account data with IDs and metadata
└── articles.json                   # Article data with text indices
```

## Architecture Notes

### State Management

The Pinia store (`stores/news.ts`) handles:
- Account and article data loading
- Filtering by selected account
- Pagination for recent articles and all articles
- Computing filtered/paginated datasets

### Data Structure

Articles include character index positions for account mentions:
```json
{
  "title": "...",
  "text": "...",
  "indices": {
    "accountId": {
      "title": [[start, end], ...],
      "text": [[start, end], ...]
    }
  }
}
```

This allows precise highlighting without regex-based matching.

### Composables

The `useNewsData` composable abstracts data fetching — swapping mock JSON imports for real API calls requires minimal changes to the store.

## Navigation Flow

```
Header Navigation
├── Recent (Home) → clears account filter
└── All Articles → clears account filter

Sidebar
└── Click account → filters all views for that account

Routes
├── / (HomeView)
├── /all (AllArticlesView)
├── /article/:id (ArticleView)
└── /account/:id (AccountView)
```

## Styling

The application uses Tailwind CSS with:
- Smooth color and scale transitions (`transition-all duration-300`)
- Responsive breakpoints (mobile-first design)
- Consistent spacing and typography scales
- Highlight styling with amber backgrounds for mention overlays

## Performance

- Vue Router uses lazy-loaded components
- Pinia computed properties cache expensive filters
- Article lists use virtual scrolling for large datasets
- Animations use CSS transitions (hardware-accelerated)
