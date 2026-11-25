import { projectSlugs } from './routePaths.js'

const desktopCapture = file => ({ file, width: 1440, height: 900 })
const mobileCapture = (slug, alt) => ({ file: slug + '-mobile.webp', width: 390, height: 844, alt, label: 'Mobile homepage' })
const interfaceCapture = (file, label, alt) => ({ ...desktopCapture(file), label, alt })

export const featuredProjects = [
  {
    slug: projectSlugs.habitat, name: 'HABITAT', type: 'Real Estate Marketplace', category: 'Real estate web application',
    theme: 'habitat',
    capture: desktopCapture('habitat.webp'),
    imageAlt: 'HABITAT homepage with architectural photography and property search',
    gallery: [
      mobileCapture('habitat', 'HABITAT property search on a mobile viewport'),
      interfaceCapture('habitat-floorplan.webp', 'Floor plan study', 'HABITAT floor plan showing the highlighted study and viewing guidance'),
      interfaceCapture('habitat-plot.webp', 'Plot Studio', 'HABITAT Plot Studio showing land dimensions, road placement, and area controls'),
      interfaceCapture('habitat-calculators.webp', 'Property calculators', 'HABITAT home loan calculator with financing inputs and estimated monthly EMI'),
    ],
    url: 'https://vishalsinghbhadoriya.github.io/habitat-real-estate/',
    source: 'https://github.com/vishalSinghBhadoriya/habitat-real-estate',
    summary: 'Search and compare properties, explore interactive floor plans and plot layouts, and estimate the cost of buying or renting.',
    stack: ['React.js', 'TypeScript', 'Redux Toolkit', 'TanStack Query', 'Tailwind CSS', 'React Router'],
    features: [
      'Find listings through URL-backed filters and map discovery, save favourites, and compare up to four properties.',
      'Inspect illustrative floor plans and plot dimensions, and calculate EMI, rental costs, and acquisition costs.',
      'Use a listing wizard to preview property data. Signed-in owners can manage listings and review enquiries and visit requests.',
    ],
  },
  {
    slug: projectSlugs.velocity, name: 'VELOCITY', type: 'Interactive Automotive Experience', category: 'Creative development · Automotive',
    theme: 'velocity', capture: desktopCapture('velocity.webp'),
    imageAlt: 'VELOCITY homepage introducing its performance car collection',
    gallery: [
      mobileCapture('velocity', 'VELOCITY automotive campaign homepage on a mobile viewport'),
      interfaceCapture('velocity-studio.webp', 'Configuration Studio', 'VELOCITY VXR-01 preview alongside paint colours and engineering packages'),
      interfaceCapture('velocity-hotspots.webp', 'Vehicle hotspots', 'Fullscreen VELOCITY vehicle image with an open feature annotation'),
    ],
    url: 'https://vishalsinghbhadoriya.github.io/velocity/',
    source: 'https://github.com/vishalSinghBhadoriya/velocity',
    summary: 'Explore a fictional performance car lineup through cinematic scroll sequences, image hotspots, and an interactive configuration studio.',
    stack: ['React.js', 'TypeScript', 'Zustand', 'GSAP', 'ScrollTrigger', 'Tailwind CSS', 'Lenis'],
    features: [
      'Search, filter, and sort the vehicle collection and explore annotated vehicle imagery in a fullscreen gallery.',
      'Preview six VXR-01 paint finishes, select engineering packages, and share or export the resulting configuration.',
      'Compare up to three models in the Performance Lab and save builds and favourites in a browser-local garage.',
    ],
  },
  {
    slug: projectSlugs.reboot, name: 'REBOOT', type: 'Mobile Repair & E-commerce Platform', category: 'E-commerce · Service platform',
    theme: 'reboot', capture: desktopCapture('reboot.webp'),
    imageAlt: 'REBOOT mobile repair homepage introducing the device assembly',
    gallery: [
      mobileCapture('reboot', 'REBOOT mobile homepage with repair booking and store links'),
      interfaceCapture('reboot-estimator.webp', 'Repair estimator', 'REBOOT repair estimator with brand and model selection and four estimation steps'),
      interfaceCapture('reboot-shop.webp', 'Electronics catalogue', 'REBOOT storefront with category, search, and brand filters'),
    ],
    url: 'https://vishalsinghbhadoriya.github.io/reboot/',
    source: 'https://github.com/vishalSinghBhadoriya/reboot',
    summary: 'Browse electronics and estimate phone repair costs by device and part grade, with a persistent cart, wishlist, and comparison tools.',
    stack: ['React.js', 'TypeScript', 'Zustand', 'Tailwind CSS', 'GSAP', 'ScrollTrigger', 'React Router', 'Three.js'],
    features: [
      'Filter and compare electronics, select variants, and save products to a cart or wishlist.',
      'Choose a device and part grade to estimate repair costs from demo pricing. Unsupported repairs lead to a quote request.',
      'Review prefilled repair or product enquiry text before handing it off to WhatsApp.',
    ],
  },
]
