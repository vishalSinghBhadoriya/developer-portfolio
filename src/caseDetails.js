export const caseDetails = {
  habitat: {
    problem: 'Bring property discovery, evaluation, and listing management into one interface while keeping filtered searches shareable.',
    architecture: [
      ['Discovery', 'React Router keeps filter state in the URL so users can return to or share a search.'],
      ['Client state', 'Redux Toolkit handles shared interaction state for features such as favourites and comparison.'],
      ['Listings', 'TanStack Query handles asynchronous listing data. The listing wizard uses React Hook Form and Zod to validate owner input.'],
    ],
    decisions: [
      ['Shareable discovery', 'Keep search criteria in the URL and support both list and map views for different browsing needs.'],
      ['Illustrative property tools', 'Present plan and plot visualizations alongside calculators so visitors can explore a property before contacting an owner.'],
      ['Responsive motion', 'Responsive layouts pair with native view transitions and animated floor-plan highlights. Reduced-motion styles limit movement.'],
    ],
  },
  velocity: {
    problem: 'Make a fictional vehicle lineup explorable through imagery, technical comparisons, and configurations visitors can revisit and share.',
    architecture: [
      ['Catalogue', 'Typed model and option data feeds lazy React Router pages, filters, and vehicle comparisons.'],
      ['Studio', 'A validated configuration drives paint variants, line items, and the total price. Share URLs encode the selection.'],
      ['Garage', 'Zustand persists favourites, saved builds, and comparison selections and validates data on rehydration.'],
    ],
    decisions: [
      ['Image-anchored hotspots', 'Recalculate coordinates from the displayed image and its letterboxing so annotations remain aligned when the viewport changes.'],
      ['Consistent configuration pricing', 'Validate options against the selected model and deduplicate package IDs before calculating line items and the total.'],
      ['Motion across input modes', 'GSAP and ScrollTrigger pin photographic crossfades on desktop with motion enabled. Touch and reduced-motion layouts keep the story in normal document flow.'],
    ],
  },
  reboot: {
    problem: 'Let shoppers explore products and estimate device-specific repair costs before sending an enquiry.',
    architecture: [
      ['Catalogue', 'Typed product and repair data define variants, prices, supported models, and repair part grades.'],
      ['Shop state', 'Zustand persists cart lines, wishlist, comparisons, and selections in the browser.'],
      ['Routes', 'Lazy React Router pages separate storefront and repair flows. Enquiry utilities build messages for users to review.'],
    ],
    decisions: [
      ['Repair pricing coverage', 'The estimator derives prices from the model and part grade and routes unsupported work to a quote request.'],
      ['Persisted data validation', 'Rehydration discards stale catalogue IDs and caps cart quantities to current catalogue limits.'],
      ['Motion and rendering fallbacks', 'GSAP and ScrollTrigger animate the responsive homepage. Motion handles route and estimator transitions. The 3D banner loads separately and uses a still image when WebGL is unavailable.'],
    ],
  },
  buynest: {
    source: 'https://github.com/vishalSinghBhadoriya/BuyNest',
    problem: 'Let shoppers move from browsing to a demo order while preserving their cart and favorites across visits.',
    architecture: [
      ['Routes', 'React Router separates the catalog, product detail, favorites, cart, checkout, and order history.'],
      ['Components', 'ProductList, ProductCard, ProductFilter, ProductImage, and CheckoutSteps isolate repeatable interface behavior.'],
      ['State', 'Cart, favorites, and orders use separate Context providers with browser storage for persistence.'],
      ['Data', 'The product service exposes asynchronous catalog lookups over bundled JSON.'],
    ],
    decisions: [
      ['State management', 'The cart provider validates restored items before using them and writes cart changes back to LocalStorage. Shared state is kept outside individual product and checkout screens.'],
      ['API and authentication', 'The verified catalog uses a local product service backed by bundled JSON. The public storefront demonstrates checkout and order history in the browser.'],
      ['Challenge and solution', 'Catalog filters and purchase state change for different reasons. The catalog keeps search and filters in the page and shares the cart, favorites, and orders through separate providers.'],
      ['Performance and responsive design', 'The ProductImage component distinguishes eager images from lazy images. The responsive storefront reorganizes product discovery, cart, and checkout for smaller screens.'],
    ],
  },
  tasksphere: {
    source: 'https://github.com/vishalSinghBhadoriya/tasksphere',
    problem: 'Give a dashboard user one place to read analytics and work with searchable, paginated records behind a sign-in flow.',
    architecture: [
      ['Protected routes', 'The login screen is an entry point. ProtectedRoute redirects unauthenticated navigation.'],
      ['Dashboard UI', 'DashboardLayout provides the shared navigation. Chart, table, modal, and loader components handle different parts of a screen.'],
      ['Redux store', 'Redux Toolkit separates auth, sidebar, and theme state into slices. The users screen owns local query and pagination behavior.'],
      ['Service layer', 'Axios and service modules connect authentication, users, and dashboard views to the API.'],
    ],
    decisions: [
      ['State management', 'Global authentication and layout preferences go in Redux Toolkit. The users screen keeps its search text and page state near the table.'],
      ['API and authentication', 'The auth service calls the login endpoint. The Axios request interceptor reads the stored token and attaches it to requests. The route guard controls frontend navigation.'],
      ['Challenge and solution', 'Record search can update more often than the table needs to render. The users screen uses a 500 ms debounce and pagination, alongside loading and error states.'],
      ['Performance and responsive design', 'Dashboard, users, projects, tasks, analytics, and settings load through lazy routes. Shared layout, card, and chart components provide consistent presentation across screens.'],
    ],
  },
  'boca-en-boca': {
    problem: 'Connect job seekers and employers through a feed and exploration experience, with dedicated profile and authentication views.',
    architecture: [
      ['Home and Explore', 'Feed and exploration views provide entry points for job discovery and platform content.'],
      ['Reusable UI', 'Shared components and navigation connect Home Feed, Explore, User Settings, and profile management.'],
      ['Account workflows', 'Authentication and profile management are part of the platform navigation.'],
      ['REST data', 'REST API integrations support job listings, profiles, authentication, search, and dynamic content.'],
    ],
    decisions: [
      ['State and component boundaries', 'Reusable components separate shared navigation from the feed, exploration, profile, and settings views. That component structure is the documented frontend boundary.'],
      ['API and authentication', 'API integrations connect the public interface to job listings and search, and support authentication and profile workflows. The public case study covers those interface boundaries.'],
      ['Challenge and solution', 'Job seekers need to move between discovery and profile tasks. Shared navigation connects those views while the feed renders API-driven listings and content.'],
      ['Performance and responsive design', 'The public screenshot documents the feed layout and shared interface. Measurements and rendering internals are outside the documented scope.'],
    ],
  },
}
