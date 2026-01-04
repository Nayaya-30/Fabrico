# Application Audit Report

## Summary
- Reviewed app router structure, providers, API routes, middleware, and key client pages. Identified architectural inconsistencies, potential bugs, and security considerations with actionable recommendations.

## Critical Issues
- Client-side redirect in a client component:
  - `src/app/(dashboard)/layout.tsx:27` uses `redirect("/sign-in")` in a component marked with `"use client"`. `redirect` is intended for server components; use `useRouter().replace("/sign-in")` inside an effect to avoid runtime errors and double renders.
- Lint errors ignored during build:
  - `next.config.mjs:3-6` sets `ignoreDuringBuilds: true`. This can allow serious issues to ship. Recommend enabling lint checks in CI and builds.

## Security Risks
- Webhook secrets handling:
  - Paystack verification uses HMAC SHA-512 correctly: `src/app/api/webhooks/paystack/route.ts:13-19`.
  - Flutterwave verification compares header `verif-hash` directly to `process.env.FLUTTERWAVE_SECRET_HASH`: `src/app/api/webhooks/flutterwave/route.ts:9-11`. Consider switching to HMAC verification if supported, or ensure the secret comparison is constant-time.
- Public environment variables in client:
  - `src/components/providers/convex-provider.tsx:7` reads `process.env.NEXT_PUBLIC_CONVEX_URL!`. If missing, the app will crash at runtime. Add a guard to surface a clear error in development and fail gracefully in production.
- Secrets in environment files:
  - `.env` files are properly ignored: `.gitignore:33-35` and `.gitignore:66-71`. Ensure no secrets are logged or accidentally exposed in client code.

## Potential Bugs
- App Router mounting order previously wrong, now fixed:
  - `src/app/layout.tsx:14-34` now returns `<html>` → `<body>` → providers → `{children}`. This resolves “expected app router to be mounted”.
- Async dynamic API usage:
  - Fixed in Clerk webhook by awaiting `headers()`: `src/app/api/auth/webhook/route.ts:16`.
  - `src/lib/supabase/server.ts:5` correctly awaits `cookies()`.
- Navigation via `window.location.href` breaks SPA behavior:
  - `src/app/(dashboard)/customer/orders/new/page.tsx:67` uses `window.location.href`. Prefer `useRouter().push` for client navigation to preserve app state.
  - `src/components/shared/ErrorBoundary.tsx:71-74` uses `window.location.href = '/'`. Consider `router.push('/')` to avoid full page reloads.
- Case-sensitive import that may break on non-Windows systems:
  - `src/components/shared/ErrorBoundary.tsx:4` imports `@/components/ui/Button` while other files import `@/components/ui/button`. Unify casing to match the actual filename to avoid build failures on Linux/macOS.
- Tailwind dynamic class generation risk:
  - `src/app/(auth)/onboarding/page.tsx:182` computes `className` with `text-${role.color.replace("bg-", "")}`. Dynamic class names may be purged; safelist these classes or map roles to explicit class names.
- Form number parsing without validation:
  - `src/app/(dashboard)/admin/styles/new/page.tsx:153-169` uses `parseFloat` and sets numbers without `isNaN` checks. Add validation to prevent `NaN` values.

## Architectural Inconsistencies
- Mixed auth providers (Clerk vs Supabase):
  - The app uses Clerk for session/UI (`src/app/layout.tsx:14-34`, Clerk pages), a Clerk webhook (`src/app/api/auth/webhook/route.ts:1-71`), but a Supabase-based `middleware.ts` for route protection (`middleware.ts:57-75`). This split can lead to users being authenticated in Clerk but blocked by Supabase checks, or vice versa. Standardize on a single auth provider for gating and session refresh.
- Incomplete onboarding flow logic:
  - `src/app/(auth)/sso-callback/page.tsx:14-19` unconditionally pushes to `/onboarding` once `user` is loaded. It does not check Convex for existing users despite the comment. Implement a check to route existing users directly to their dashboards.
- Provider initialization robustness:
  - `src/components/providers/convex-provider.tsx:7-10` initializes a client at module scope with a non-null assertion. Wrap initialization with a runtime check and informative error to prevent silent failures.
- ThemeProvider renders nothing until mount:
  - `src/lib/theme/theme-provider.tsx:48-50` returns `null` until the client mounts, causing a flash of empty content. Consider server-side default theme class and rendering children with hydration-safe strategy to avoid blank screen on first paint.

## Recommendations
- Auth
  - Choose Clerk or Supabase for route protection. If staying with Clerk, replace Supabase `middleware.ts` with Clerk’s `authMiddleware` or custom checks using Clerk’s server helpers.
- Navigation
  - Replace `window.location.href` usages with `useRouter().push` to maintain SPA navigation and state.
- Imports
  - Standardize import casing across the codebase to avoid platform-specific build failures.
- Validation
  - Add `isNaN` checks and form validation for numeric fields in admin style forms.
- Styling
  - Replace dynamic Tailwind class string generation with explicit class maps or safelist required classes in Tailwind config.
- Providers
  - Add runtime guards for required public env vars (Convex URL, Supabase URL/key) to surface clear errors during development.
- Build Quality
  - Re-enable linting in builds and add a `typecheck` script (e.g., `tsc --noEmit`) to CI.
  - Align TypeScript and `@typescript-eslint` versions to supported ranges.
  - Update `@types/react` and `@types/react-dom` to match React 19 to reduce type friction: `package.json:19-21`, `package.json:26-29`.

## Notable References
- Root layout: `src/app/layout.tsx:14-34`
- Dashboard layout: `src/app/(dashboard)/layout.tsx:27`
- New order page: `src/app/(dashboard)/customer/orders/new/page.tsx:67`
- Admin new style page: `src/app/(dashboard)/admin/styles/new/page.tsx:153-169`
- Onboarding page: `src/app/(auth)/onboarding/page.tsx:182`
- SSO callback: `src/app/(auth)/sso-callback/page.tsx:14-19`
- Error boundary: `src/components/shared/ErrorBoundary.tsx:4`, `src/components/shared/ErrorBoundary.tsx:71-74`
- Convex provider: `src/components/providers/convex-provider.tsx:7-10`
- Supabase server cookies: `src/lib/supabase/server.ts:5`
- Paystack webhook: `src/app/api/webhooks/paystack/route.ts:13-19`
- Flutterwave webhook: `src/app/api/webhooks/flutterwave/route.ts:9-11`
- Clerk webhook: `src/app/api/auth/webhook/route.ts:16`
- Middleware (Supabase): `middleware.ts:57-75`
- Lint ignore: `next.config.mjs:3-6`
- Package versions: `package.json:19-21`, `package.json:26-29`
