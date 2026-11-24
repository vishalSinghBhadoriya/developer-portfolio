# Vishal Bhadoriya · Developer Portfolio

A React portfolio for frontend engineering and creative development. [Visit the portfolio](https://vishalsinghbhadoriya.github.io/developer-portfolio/)

## Features

- Fullscreen GPU particle sculpture with scroll morphing, pointer displacement, adaptive rendering, and a still fallback.
- Interactive previews and technical case studies for BuyNest, TaskSphere, and Boca En Boca.
- Developer Playground with adjustable GSAP and particle demos, a Redux Toolkit store, debounced search, and an interactive sorting visualization.
- Searchable command palette with Ctrl+K or Cmd+K, keyboard navigation, résumé download, and email copy.
- Responsive layouts, reduced-motion support, and a keyboard-accessible technology map and project diagrams.

## Technology stack

React 19, React Router, Vite, Tailwind CSS, Three.js, React Three Fiber, GLSL, GSAP and ScrollTrigger, Lenis, Motion, Redux Toolkit, and Lucide.

## Development

Use Node.js 22 and npm.

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

Open the URL Vite prints with the `/developer-portfolio/` prefix. The production output is written to `dist/`.

## Architecture

| Path | Responsibility |
| --- | --- |
| `src/App.jsx`, `src/CommandPalette.jsx` | Router, navigation, keyboard commands, and application shell |
| `src/Home.jsx`, `src/sections.jsx`, `src/ProjectStories.jsx`, `src/Toolkit.jsx` | Homepage sections and project interactions |
| `src/data.js`, `src/caseDetails.js` | Professional content, project data, and technical case study details |
| `src/CaseStudy.jsx`, `src/Playground.jsx` | Lazy-loaded case study and playground routes |
| `src/ParticleField.jsx`, `src/ParticleScene.jsx`, `src/particleGeometry.js` | Particle geometry, WebGL rendering, and fallbacks |
| `src/motion.js`, `src/RouteTransition.jsx` | GSAP, ScrollTrigger, Lenis, and deferred Motion effects |
| `src/assets.js`, `src/routePaths.js`, `vite.config.js` | Base-aware public assets and static route entries |
| `public/` | WebP previews, still particle artwork, favicon, and public résumé |

Desktop scroll effects use GSAP and ScrollTrigger. Narrow-screen reveals start through IntersectionObserver. The particle vertex shader blends deterministic ribbon, wave, and prism geometry and applies a procedural flow field. Scroll and pointer input reach the render loop through refs.

The hero and contact scenes load near the viewport and dispose their renderers when they leave it. Pixel ratio drops when frame times stay high. The playground uses a capped Canvas 2D renderer when WebGL is unavailable. Case studies, the playground, Motion transitions, Redux Toolkit, and WebGL are split into separate production chunks.

## GitHub Pages deployment

1. In the repository, open [Settings → Pages](https://github.com/vishalSinghBhadoriya/developer-portfolio/settings/pages) and choose **GitHub Actions** under **Build and deployment → Source**.
2. Push to `main`. The [Pages workflow](.github/workflows/pages.yml) installs dependencies, runs lint, builds the site, uploads `dist/`, and deploys it to the `github-pages` environment.
3. If Pages was enabled after the first push, open the [Actions tab](https://github.com/vishalSinghBhadoriya/developer-portfolio/actions) and run **Deploy portfolio to GitHub Pages** on `main`. The deploy job reports the public URL.

Vite and React Router share the `/developer-portfolio/` base path. The build emits directory index files for each known case study and `/playground`, so the clean URLs work on direct visits and refreshes. An additional `404.html` serves the app’s not-found route for unknown paths. Vercel builds use a root base path and the included rewrite configuration.

## Customize

Edit `src/data.js` and `src/caseDetails.js` to update portfolio content. Store optional settings in `.env.local`. Set `VITE_PORTRAIT_URL` to a public image URL or a path such as `/portrait.jpg` inside `public/`. Set `VITE_PUBLIC_PHONE` only to display a number publicly. Vite exposes all configured `VITE_` values in the client bundle.

Replace the downloadable résumé at `public/Vishal_Bhadoriya_Frontend_Developer.pdf` with a copy intended for public sharing.
