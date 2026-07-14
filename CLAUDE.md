# SoukPro — Project Context Document

## Project Overview

**SoukPro (سوق المغرب)** is a Moroccan marketplace web application for buying, selling, and discovering handcrafted products, spices, leather goods, and more. It functions as a classified-ads/e-commerce hybrid platform targeting Moroccan artisans and buyers. The UI is Arabic-first (RTL layout) and the app is styled to mimic a mobile app experience within a browser (phone-width container).

**Core capabilities:**
- User authentication (register, login, password reset)
- Product/listing browsing, searching, and filtering
- Product detail views with star ratings
- Shopping cart and wishlist
- Ad/listing posting by authenticated users
- **Edit and delete of user's own listings**
- Order tracking
- User profiles
- Notifications
- Supabase backend (auth + database + storage)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.7 |
| Build Tool | Vite 7 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) |
| Icons | Lucide React v1.21 |
| Backend/Auth | Supabase (`@supabase/supabase-js` v2) |
| Linting | ESLint 9 + typescript-eslint + react-hooks + react-refresh |
| Package Manager | npm (lockfile v3) |

---

## Architecture

### High-Level Structure

```
src/
├── App.tsx                  # Root component: routing, layout, lazy loading
├── main.tsx                 # Entry point, renders <App> in StrictMode
├── index.css                # Global styles (Tailwind import + base/utilities)
├── App.css                  # Legacy template CSS (mostly unused)
├── theme.ts                 # Centralized design tokens (COLORS, RADIUS, etc.)
├── types.ts                 # Shared TypeScript interfaces/types
├── data.ts                  # Static/mock data (seed data for listings, categories)
├── lib/
│   └── supabase.ts          # Supabase client initialization
├── context/
│   └── AppContext.tsx        # Global React context: auth state, cart, wishlist, etc.
├── components/
│   ├── ProductCard.tsx       # Reusable product/listing card
│   ├── SearchBar.tsx         # Search input component
│   ├── StarRating.tsx        # Star rating display component
│   └── TabBar.tsx            # Bottom navigation tab bar
└── screens/
    ├── AuthScreens.tsx       # WelcomeScreen, LoginScreen, RegisterScreen, ResetPasswordScreen
    ├── HomeScreen.tsx        # Landing feed with categories and featured listings
    ├── ProductScreen.tsx     # Product detail view
    ├── ListingScreen.tsx     # User's own listings management (view, edit, delete)
    ├── SearchScreen.tsx      # Search results
    ├── CartScreen.tsx        # Shopping cart
    ├── WishlistScreen.tsx    # Saved/favorited items
    ├── ProfileScreen.tsx     # User profile and settings
    ├── PostAdScreen.tsx      # Create/post a new listing ad (also used for editing)
    ├── OrdersScreen.tsx      # Order history
    ├── NotificationsScreen.tsx # In-app notifications
    └── AboutScreen.tsx       # App info page
```

### Routing Model

Routes are defined in `App.tsx` using React Router v7 with **lazy-loaded screens** via `React.lazy()` + `Suspense`. Each screen is a named export from its module, wrapped in a `.then(m => ({ default: m.ScreenName }))` pattern.

**Route map:**
```
/welcome          → WelcomeScreen
/login            → LoginScreen
/register         → RegisterScreen
/reset-password   → ResetPasswordScreen
/                 → HomeScreen
/product/:id      → ProductScreen
/listing/:id      → ListingScreen
/search           → SearchScreen
/cart             → CartScreen
/wishlist         → WishlistScreen
/profile          → ProfileScreen
/about            → AboutScreen
/post_ad          → PostAdScreen
/post_ad?edit=:id → PostAdScreen (edit mode, loads existing listing by id)
/notifications    → NotificationsScreen
/orders           → OrdersScreen
```

**Tab bar visibility:** The `TabBar` component is hidden on auth screens, detail screens (`/product/*`, `/listing/*`), and utility screens (`/about`, `/post_ad`, `/notifications`, `/orders`, `/reset-password`). This is controlled by the `NO_TAB_PATHS` set and `needsTab()` helper in `App.tsx`.

### State Management

Global state lives in **`AppContext`** (`src/context/AppContext.tsx`), consumed via the `useApp()` hook. This context manages:
- Authentication state (current user session from Supabase)
- Cart items
- Wishlist items
- Possibly active screen/navigation state

No external state library (Redux, Zustand, etc.) is used.

### Backend (Supabase)

The Supabase client is initialized in `src/lib/supabase.ts` using environment variables (likely `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).

**Database migrations** (in `supabase/migrations/`):
| File | Purpose |
|---|---|
| `20260626140719_create_listings_bucket.sql` | Creates Supabase Storage bucket for listing images |
| `20260703200143_create_listings_table.sql` | Creates `listings` table |
| `20260704223354_fix_storage_insert_policy.sql` | Fixes RLS policy for storage uploads |
| `20260704224505_disable_email_confirmation.sql` | Disables email confirmation for auth |
| `20260704225205_add_missing_listing_columns.sql` | Schema patch: adds missing columns to listings |

**RLS Policies (listings table):**
- Users can only update/delete rows where `user_id = auth.uid()` — enforced at the database level
- Edit and delete operations from the client rely on this policy; no additional server-side checks needed

---

## Key Files Reference

### `src/types.ts`
Central type definitions. All shared interfaces (e.g., `Product`, `Listing`, `User`, `CartItem`) are defined here. Always check this file before creating new types.

### `src/theme.ts`
Design token exports: `COLORS`, `RADIUS`, and possibly typography/spacing constants. Use these tokens for inline styles instead of hardcoding values. Example usage from `App.tsx`:
```ts
import { COLORS, RADIUS } from './theme';
// Used as: background: COLORS.background, borderRadius: RADIUS.md
```

### `src/data.ts`
Static seed/mock data for products, categories, etc. Used as fallback or initial data before Supabase data loads.

### `src/lib/supabase.ts`
Supabase client singleton. Import `supabase` from here for all database/auth/storage operations.

### `src/context/AppContext.tsx`
Provides `AppProvider` (wrap at root) and `useApp()` hook. All screens access global state through this hook.

### `src/App.tsx`
- Wraps the entire app in `AppProvider` and `BrowserRouter`
- Defines the `PHONE_W = 430` constant for the mobile-phone-width container
- Contains `PasswordRecoveryHandler` component for handling Supabase password reset email links (reads URL hash for recovery tokens)
- Renders `TabBar` conditionally based on current path

### `src/screens/ListingScreen.tsx`
Displays the detail view for a single user listing. When the authenticated user owns the listing, it shows **Edit** and **Delete** action buttons. Delete triggers a confirmation dialog before calling Supabase. Edit navigates to `PostAdScreen` in edit mode.

### `src/screens/PostAdScreen.tsx`
Handles both **creating** and **editing** listings. When accessed via `/post_ad?edit=:id`, it fetches the existing listing data, pre-fills the form fields, and on submit calls a Supabase `update` instead of `insert`. The mode is determined by reading the `edit` query parameter via React Router's `useSearchParams`.

---

## UI & Styling Conventions

### Layout Philosophy
The app simulates a **mobile phone shell** at `430px` max-width, centered on the screen. The `#root` element spans full width, but the inner container is constrained. Background of the outer area is `#0f0f0f` (near-black).

### Direction
The HTML element has `lang="ar" dir="rtl"` — the entire app is **right-to-left**. All layout assumptions (margins, flex directions, icon placement) should account for RTL.

### Styling Approach
- **Tailwind CSS v4** utility classes for layout, spacing, and common styles
- **Inline styles** for dynamic/theme-driven values (colors from `COLORS`, border-radius from `RADIUS`)
- Avoid hardcoded hex colors in components — use `theme.ts` tokens
- Custom utilities in `index.css`: `line-clamp-1`, `line-clamp-2`, `scrollbar-hide`, `safe-top`, `tap-highlight-none`

### Confirmation Dialogs
Destructive actions (e.g., deleting a listing) use an **inline confirmation UI** rendered within the screen itself — not native `window.confirm()`. The pattern is a conditional render of a confirmation prompt (with "تأكيد" / "إلغاء" buttons) toggled by local component state. This keeps the UI consistent with the app's custom styling.

### Component Style
- Functional components with TypeScript
- Named exports for all screens (default export only for `App`)
- Screens are self-contained and handle their own data fetching
- `lucide-react` for all icons

### Loading State
A spinner component `ScreenLoader` is defined in `App.tsx` and used as the `Suspense` fallback:
```tsx
<div style={{ width: 32, height: 32, border: `3px solid ${COLORS.primary}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
```
The `spin` keyframe is defined in `index.css`.

---

## Development Workflow

### Scripts
```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Type-check (tsc -b) then Vite production build
npm run lint      # Run ESLint across all TS/TSX files
npm run preview   # Preview production build locally
```

### Environment Variables
Create a `.env` file (gitignored) at the project root with:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Path Aliases
`@/` maps to `src/` — configured in both `vite.config.ts` and `tsconfig.app.json`:
```ts
import { useApp } from '@/context/AppContext';
```

### TypeScript Configuration
- **Target:** ES2023
- **Module resolution:** Bundler mode
- **Strict mode:** Partially relaxed — `noUnusedLocals` and `noUnusedParameters` are `false` in `tsconfig.app.json` (rapid development mode)
- `skipLibCheck: true` to avoid type errors in node_modules

### Build & CI Requirements
- The production build (`npm run build`) runs `tsc -b` (full type-check) **before** Vite bundling. **TypeScript errors will fail the Vercel deployment.** All type errors must be resolved before merging to main.
- Common sources of build-breaking type errors to watch for:
  - Missing or incorrect properties on Supabase query result types
  - Mismatched types between `types.ts` interfaces and actual Supabase row shapes
  - Implicit `any` in event handlers or async callbacks
  - Unused imports that may conflict with strict future configs
- When fixing type errors, prefer **type assertions** (`as`) or **type narrowing** (guards, optional chaining) over loosening the TypeScript configuration further.

### ESLint Configuration
- Uses flat config format (`eslint.config.js`)
- Plugins: `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- `dist/` is globally ignored

---

## Supabase Integration Notes

- **Auth:** Email/password auth with email confirmation **disabled** (see migration). Password reset via email link is handled by `PasswordRecoveryHandler` in `App.tsx`, which reads the URL hash for `type=recovery` token.
- **Storage:** A `listings` bucket exists for product images. The storage insert policy was patched (see migrations).
- **Database:** A `listings` table with RLS policies. Schema was iteratively updated via migrations.
  - **Edit:** `supabase.from('listings').update({...}).eq('id', id).eq('user_id', user.id)`
  - **Delete:** `supabase.from('listings').delete().eq('id', id).eq('user_id', user.id)`
  - Both operations double-filter by `user_id` on the client in addition to RLS for defense-in-depth.
- All Supabase calls should use the client from `src/lib/supabase.ts`.
- **Supabase query result typing:** When accessing data from Supabase query results, be explicit about the expected shape. The `data` returned from `.select()` queries is typed as an array; always check for `null`/`undefined` before accessing properties. Avoid relying on inferred types from the generic Supabase client when the schema is manually defined — cast or assert as needed.

---

## Naming Conventions

| Entity | Convention |
|---|---|
| Components | PascalCase (`ProductCard`, `TabBar`) |
| Screens | PascalCase + `Screen` suffix (`HomeScreen`, `CartScreen`) |
| Hooks | camelCase + `use` prefix (`useApp`) |
| Context providers | PascalCase + `Provider` suffix (`AppProvider`) |
| Types/Interfaces | PascalCase (`Product`, `CartItem`) |
| Constants | SCREAMING_SNAKE_CASE (`COLORS`, `PHONE_W`, `NO_TAB_PATHS`) |
| Files | camelCase for utilities (`supabase.ts`, `theme.ts`), PascalCase for components/screens |

---

## Important Constraints & Gotchas

1. **RTL layout** — Always design UI with right-to-left reading direction. Flex row is visually reversed. `start`/`end` are preferred over `left`/`right` when possible.
2. **Mobile-first at fixed width** — The container is always `430px` wide. Do not design for fluid/wide layouts.
3. **Named screen exports** — All screens use named exports, not default exports. The lazy import pattern must use `.then(m => ({ default: m.ScreenName }))`.
4. **No email confirmation** — Auth flow goes directly from register to logged-in state.
5. **Theme tokens are mandatory** — Do not hardcode colors; use `COLORS` from `src/theme.ts`.
6. **Supabase client is a singleton** — Always import from `src/lib/supabase.ts`, never create a new client.
7. **TypeScript linting is relaxed** — Unused variables won't cause build failures, but keep code clean regardless.
8. **Edit mode via query param** — `PostAdScreen` detects edit mode through the `edit` query parameter (`?edit=:id`). When building navigation to edit a listing, use `navigate('/post_ad?edit=' + id)` rather than a separate route.
9. **Destructive action confirmation** — Always use inline UI confirmation (local state toggle) for destructive actions; never use `window.confirm()` or `window.alert()`.
10. **Owner-only mutations** — Edit/delete UI controls must only be rendered when the current authenticated user's `id` matches the listing's `user_id`. Always verify ownership both in the UI (conditional render) and in the Supabase query (`.eq('user_id', user.id)`).
11. **TypeScript errors block production builds** — The `tsc -b` step in `npm run build` is a hard gate for Vercel deployments. Any TypeScript error — including type mismatches on Supabase results, implicit `any`, or incorrect interface usage — will prevent deployment. Always