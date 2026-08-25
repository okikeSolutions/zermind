# Why we are migrating to TanStack Start and StyleX

Status: implementation complete; production acceptance pending
Date: 2026-08-25

## Decision

We moved the Zermind web app from the Next.js App Router to TanStack Start in SPA mode, using Vite as the build tool. Tailwind CSS was replaced with StyleX.

This changes the web framework and styling system. Convex remains the application backend and real-time data layer. The migration must preserve the auth HTTP endpoints, route protection, analytics proxying, security headers, public metadata, and deep-link behavior that Next.js handles today.

For StyleX, we should use the plain Vite and React integration. The Vite RSC setup builds separate RSC, SSR, and client environments, which adds machinery that an SPA does not use.

## Internationalization

The TanStack Start app uses Paraglide JS for locale detection, translated messages, and localized URLs. English and German pages use `/en` and `/de` prefixes.

The integration follows the TanStack Start example at the framework boundaries:

- the Paraglide Vite plugin compiles messages from `messages/`
- TanStack Router rewrites localized URLs to the internal route tree and localizes generated links
- server middleware establishes request-scoped locale state for SSR
- the root document reads the active locale for the HTML `lang` attribute
- prerender requests carry explicit locale headers so static HTML has the correct metadata and content
- canonical links, hreflang alternates, JSON-LD, and the sitemap use localized URLs

API routes and machine-readable files are excluded from locale redirects. The generated `src/paraglide/` directory stays untracked and is rebuilt before type checking and tests.

## What changed

- File-based routes now live in `src/routes` and generate a typed TanStack Router tree.
- TanStack Start prerenders the SPA shell while Nitro serves server functions, Better Auth, the sitemap, and dynamic share data.
- Convex is connected through `ConvexQueryClient`, TanStack Query, and `ConvexBetterAuthProvider` following the Convex TanStack Start integration pattern.
- Better Auth now uses the TanStack Start adapter at `/api/auth/$`. Protected and collaboration routes check the server session before loading and redirect anonymous requests to `/auth/login`.
- Next.js navigation and image imports were replaced by TanStack Router and standard browser images. Next.js, its route tree, configuration, and lint rules were removed.
- JSX styling now goes through the StyleX adapter. Direct utilities compile to StyleX declarations. Selector patterns that StyleX cannot represent directly, such as group and peer relationships, live in a generated static compatibility stylesheet. Tailwind, PostCSS, `tailwind-merge`, and Tailwind build tooling are not installed or run.
- Public environment variables use `VITE_*`. The previous `NEXT_PUBLIC_*` Convex names remain accepted as temporary deployment aliases.
- Vercel retains the analytics proxy and response security headers. Nitro owns application and API routing, so direct SPA URLs do not require a catch-all that could capture auth endpoints.
- Public SEO metadata now comes from a shared route helper. It emits titles, descriptions, canonical URLs, Open Graph tags, Twitter cards, and optional JSON-LD. Home renders `WebApplication` data, and public shared chats render `CreativeWork` data.
- Demo and legal routes are prerendered as complete HTML. The session-aware home route and dynamic shared chats remain server-rendered through Nitro. The SPA shell remains available for client-side fallback behavior.
- `robots.txt` blocks auth, protected, and collaboration paths. Those routes also emit `noindex`. The sitemap contains the home page, demos, privacy policy, terms, and imprint. Missing shared chats return HTTP 404 with `noindex` metadata.

The production build, type check, formatter, linter, migration contract tests, and SEO metadata tests pass. Direct HTTP smoke tests cover public routes, all demo scenarios, canonical and social metadata, crawler controls, the sitemap, the auth session endpoint, 404 handling, and anonymous protected-route redirects. Authenticated OAuth, password reset, collaboration, and chat streaming still require production-like acceptance testing with real credentials.

## Why this fits Zermind

Zermind behaves more like an interactive application than a server-rendered content site. Chat, mind maps, collaboration, account management, file handling, and most of the component library depend on browser state, effects, event handlers, or live Convex data.

The pre-migration repository snapshot supported that assessment:

| Current coupling                 | Count | What it means                                                                               |
| -------------------------------- | ----: | ------------------------------------------------------------------------------------------- |
| Files with `"use client"`        |    65 | Interactive React is already the normal execution model.                                    |
| Files importing a Next.js API    |    30 | Routing, metadata, images, fonts, scripts, redirects, and server helpers need replacements. |
| App Router route files           |    25 | The route migration is substantial but bounded.                                             |
| TSX files containing `className` |    78 | Styling reaches most of the UI.                                                             |
| `className` occurrences          | 1,567 | Replacing Tailwind is a planned rewrite, not a package swap.                                |

Next.js defaults App Router components to React Server Components. TanStack Start defaults to interactive React components that can still render on the server when SSR is enabled. That default matches this codebase better and removes the need to mark most of the component tree with `"use client"`. The [TanStack comparison](https://tanstack.com/start/latest/docs/framework/react/start-vs-nextjs) describes this as a difference in defaults and control, not a difference in whether either framework can render on the server.

Convex already owns most application data, live updates, files, and long-running backend work. Moving the UI to an SPA makes that client-to-Convex architecture explicit. TanStack Start still leaves room for server functions and server routes where an HTTP boundary is necessary.

## Expected benefits

### A rendering model that matches the product

The protected app is interactive after load and stays open while data changes in real time. An SPA avoids maintaining React Server Component boundaries across code that primarily runs in the browser. It also reduces the number of framework-specific decisions developers must make when adding state, effects, or event handlers.

TanStack Start SPA mode prerenders a root shell and renders the matched route in the browser. The shell can be served from static hosting, while server function and API paths can still go to a server. This can simplify web delivery and lower hosting requirements for the UI. It does not remove the need for a server wherever auth or other HTTP endpoints require one. See the [SPA mode guide](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode).

### Compile-time routing contracts

TanStack Router generates route types and checks paths, links, path parameters, search parameters, loader context, and loader data. This should turn several navigation errors into compile errors. Typed and validated search parameters are particularly useful for filters, selected chat state, demo scenarios, and future share views.

Route loaders and route guards also give auth checks and initial data dependencies an explicit home. Today these concerns are split across async layouts, redirects, client hooks, and Next navigation helpers.

### Visible data and cache behavior

TanStack Start puts loaders, middleware, and cache settings in application code. This makes ownership and invalidation easier to inspect than a collection of framework defaults. TanStack Router and TanStack Query use familiar stale-while-revalidate controls such as `staleTime` and `gcTime`.

This does not mean Zermind should add a second cache in front of every Convex query. The benefit is control. We can use route caching for route-owned work and let Convex keep ownership of live application data.

### Standard Vite tooling

TanStack Start supports Vite directly. That gives the project Vite's plugin ecosystem and makes the build configuration less specific to one hosting company. TanStack claims faster startup and hot updates than the Next.js toolchain, but we should treat that as a hypothesis until we benchmark this repository.

The migration also makes static-shell deployment possible on providers that support the required fallback rewrite. Hosting must serve real assets first, route server endpoints correctly, and rewrite other application paths to `/_shell.html`.

### Typed styles and safer composition

StyleX moves styles from untyped utility strings to named, typed style objects. It provides typed theme variables and allows components to accept constrained style references instead of arbitrary class strings. The largest gain over Tailwind is not atomic CSS. Both systems generate compact reusable CSS. The gain is a stronger contract between TypeScript, design tokens, component variants, and overrides.

StyleX also defines deterministic composition across files. When style references conflict, the last applied style wins, including shorthand and longhand properties. This is useful in reusable primitives such as buttons, dialogs, sidebars, and form controls, where Tailwind currently relies on `class-variance-authority`, `clsx`, and `tailwind-merge` to assemble and resolve class strings.

StyleX compiles styles at build time and appends the aggregated output to Vite's CSS asset. Production rendering does not depend on runtime style injection. The [Vite and React guide](https://stylexjs.com/docs/learn/installation/vite/vite-react) requires one root CSS import and places the StyleX plugin before the React plugin to preserve Fast Refresh.

### A more explicit design system

The current Tailwind theme is built from CSS custom properties in `src/app/globals.css`, and component variants are spread across long class strings. StyleX can move semantic tokens into typed variable files and keep component states beside their components. JSX names the intent, such as `styles.selected` or `styles.destructive`, instead of carrying the full declaration.

Global CSS will not disappear. Resets, font faces, document defaults, and the CSS entrypoint still belong in a small global file.

## Costs and risks we accept

### SPA output changes public rendering

SPA mode sends a shell for matched routes and waits for JavaScript before rendering their content. That can delay useful content on a cold load and gives crawlers and link-preview bots less HTML than SSR.

Zermind has public landing, demo, legal, and shared-chat routes. The demo sitemap and per-chat metadata show that public discovery and link previews are intentional. Fixed public routes can be prerendered, but dynamic shared-chat metadata needs a separate design. We should not ship the SPA cutover until we have tested search indexing and share previews against production-like output.

If those requirements cannot be met with prerendering or dedicated metadata endpoints, the decision should change from a blanket SPA to a split rendering strategy.

### Auth needs a new framework boundary

The current root layout fetches a token on the server. Protected layouts call a Next-specific Better Auth helper and issue server redirects. The auth handler also uses the Convex Better Auth Next.js adapter.

The migration needs a proven replacement for all three behaviors:

- serving the Better Auth `GET` and `POST` endpoints;
- restoring the client session and Convex token without exposing credentials;
- blocking protected routes before their UI and protected data load.

This is a migration gate, not follow-up cleanup.

### Next.js platform features need owners

The current Next configuration handles remote image rules, analytics rewrites, production console removal, and response security headers. The root layout handles Google font optimization and analytics script loading. TanStack Start has equivalents or allows standards-based replacements, but none will move automatically.

Public environment variables currently use the `NEXT_PUBLIC_*` prefix. Vite exposes `VITE_*` by default, so the migration must either rename the public variables across code, deployment settings, and documentation or configure and document a deliberate Vite prefix. The SPA fallback must also exclude `/api/auth/*` and any future server-function paths.

The [Next.js migration guide](https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js) also calls out replacements for `next/image`, `next/font`, links, metadata, redirects, loaders, server actions, and route handlers. It is a syntax guide for a basic app, not a complete plan for Zermind.

### StyleX imposes static-analysis rules

StyleX definitions must be statically analyzable. Imported design values must use StyleX variables, and computed styles need supported dynamic-style patterns. Tailwind responsive prefixes, state variants, arbitrary values, animations, and `@apply` rules all need deliberate translations.

The migration used a one-time Tailwind compiler pass to preserve selector-heavy rules while the JSX call sites were converted. The resulting stylesheet is checked in as static CSS and has no Tailwind runtime or build dependency. StyleX CSS layers and the static stylesheet are loaded in a defined order from the root route.

We should not use the [Vite RSC integration](https://stylexjs.com/docs/learn/installation/vite/vite-rsc) for the SPA. It requires separate RSC, SSR, and client build environments plus development CSS injection. Those costs only make sense if we later adopt RSC.

### The ecosystem is smaller

Next.js has more examples, integrations, hosting-specific features, and developers with production experience. It also includes image and font optimization. TanStack Start uses pluggable replacements and requires more decisions from the application team.

We are choosing explicit control, typed routing, and a client-first model. We should expect to own more integration work in return.

## What we are not claiming

This decision does not guarantee a faster application, a smaller bundle, or cheaper hosting by itself. Tailwind already performs build-time CSS generation, and Next.js can build highly interactive applications. Performance depends on the migrated code, chunking, data access, assets, and hosting configuration.

We will record current and migrated measurements for:

- cold development startup and hot-update time;
- production JavaScript and CSS transferred on representative routes;
- first content and time to usable UI on a cold mobile profile;
- navigation time between protected routes;
- static hosting and server execution cost.

The migration succeeds only if those measurements are acceptable and route behavior remains correct.

## How the migration was executed

1. Establish TanStack Start, Vite, Nitro, typed routing, Convex Query, and Better Auth before changing route components.
2. Recreate the full route inventory and server-side auth guards, then generate and type-check the route tree.
3. Convert navigation and image boundaries so feature components no longer import Next.js.
4. Route every JSX style through StyleX, preserve structural selectors as static CSS, then remove Tailwind and PostCSS packages.
5. Restore deployment behavior, environment documentation, analytics rewrites, security headers, metadata, and static public assets.
6. Verify the production build and direct URL behavior, with authenticated production acceptance kept as a release gate.

## Go-live conditions

- Every existing route has an agreed TanStack route, redirect, or removal.
- Auth callbacks, session restoration, protected routes, logout, and password-reset links work after direct navigation and refresh.
- Convex queries, mutations, file URLs, collaboration presence, and chat streaming pass regression tests.
- Public routes meet the agreed indexing and link-preview requirements.
- Deep links work on the chosen host through `/_shell.html` fallback rules, without capturing assets or server endpoints.
- Analytics rewrites and security headers have tested replacements.
- Visual regression checks cover light and dark themes, responsive layouts, focus states, and component variants.
- Benchmarks show no unacceptable regression in cold-load usability or production payloads.
- Tailwind, PostCSS integration, `tailwind-merge`, and unused class-assembly code are removed after the last conversion.

## Sources

- [TanStack Start migration from Next.js](https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js)
- [TanStack Start compared with Next.js](https://tanstack.com/start/latest/docs/framework/react/start-vs-nextjs)
- [TanStack Start SPA mode](https://tanstack.com/start/latest/docs/framework/react/guide/spa-mode)
- [TanStack Start SEO](https://tanstack.com/start/latest/docs/framework/react/guide/seo)
- [StyleX with Vite and React](https://stylexjs.com/docs/learn/installation/vite/vite-react)
- [StyleX with Vite and React Server Components](https://stylexjs.com/docs/learn/installation/vite/vite-rsc)
- [Convex TanStack Start quickstart](https://docs.convex.dev/quickstart/tanstack-start)
