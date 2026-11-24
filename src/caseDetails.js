export const caseDetails = {
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
