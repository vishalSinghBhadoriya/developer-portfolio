import { publicAsset } from './assets'
import { featuredProjects } from './featuredProjects'
import { projectSlugs } from './routePaths'

const portrait = import.meta.env.VITE_PORTRAIT_URL?.trim()

export const profile = {
  name: 'Vishal Bhadoriya',
  email: 'vishalbhadoriya9765@gmail.com',
  linkedin: 'https://www.linkedin.com/in/vishal-singh-bhadoriya',
  github: 'https://github.com/vishalSinghBhadoriya',
  portrait: portrait ? publicAsset(portrait) : undefined,
  phone: import.meta.env.VITE_PUBLIC_PHONE?.trim(),
  resume: publicAsset('Vishal_Bhadoriya_Frontend_Developer.pdf'),
}

export const archivedProjects = [
  {
    slug: projectSlugs.buyNest, name: 'BuyNest', type: 'E-commerce Storefront', theme: 'shop', image: '/buynest-storefront.jpg',
    url: 'https://vishalsinghbhadoriya.github.io/BuyNest/',
    summary: 'A responsive shopping experience from product discovery through checkout.',
    stack: ['React 19', 'Vite', 'Tailwind CSS', 'React Router', 'Context API', 'Framer Motion'],
    features: [
      'Product search and category, price, and rating filters support browsing across the storefront.',
      'Context API and LocalStorage keep the shopping cart and wishlist persistent.',
      'A three-step checkout covers shipping details, order review, and demo payment, with order history available afterward.',
      'GitHub Actions builds and deploys the storefront to GitHub Pages.',
    ],
  },
  {
    slug: projectSlugs.taskSphere, name: 'TaskSphere', type: 'SaaS Admin Dashboard', theme: 'dashboard', image: '/tasksphere-dashboard.jpg',
    url: 'https://tasksphere-sigma.vercel.app/',
    summary: 'An admin dashboard for managing records and reading application analytics.',
    stack: ['React.js', 'Redux Toolkit', 'Tailwind CSS', 'Axios', 'Chart.js'],
    features: [
      'Authentication workflows and protected routes control access to the dashboard.',
      'Redux Toolkit centralizes state for CRUD operations, search, and paginated records.',
      'Chart.js presents analytics in the dashboard.',
      'The production build and application settings were optimized for deployment.',
    ],
  },
  {
    slug: projectSlugs.bocaEnBoca, name: 'Boca En Boca', type: 'Social Hiring Platform', theme: 'social', image: '/boca-en-boca.png',
    url: 'https://www.bocaenboca.app/',
    summary: 'A social platform that connects employers and job seekers through a shared feed and job discovery.',
    stack: ['React.js', 'JavaScript', 'REST APIs'],
    features: [
      'Reusable components support the Home Feed, Explore, and User Settings.',
      'Authentication and Profile Management are integrated into the platform navigation.',
      'REST APIs drive job listings, user profiles, authentication, search, and dynamic content.',
    ],
  },
]

export { featuredProjects }

export const projects = [...featuredProjects, ...archivedProjects]

export const skills = [
  ['Languages', ['TypeScript', 'JavaScript ES6+', 'HTML5', 'CSS3']],
  ['Frontend', ['React.js', 'Tailwind CSS', 'React Router']],
  ['State Management', ['Redux Toolkit', 'Context API', 'Zustand']],
  ['API Integration', ['REST APIs', 'Axios', 'TanStack Query']],
  ['Animation and Creative Development', ['GSAP', 'ScrollTrigger', 'Three.js', 'Framer Motion', 'Lenis']],
  ['Tools', ['Git', 'GitHub', 'GitHub Actions', 'Vite', 'Vercel']],
]

export const experience = [
  'Built and maintained 15+ reusable React components for modular, consistent interfaces.',
  'Integrated 10+ REST API endpoints with Axios to power dynamic frontend features.',
  'Centralized state in 5+ Redux Toolkit slices, simplifying data flow across 20+ components.',
  'Created interactive animations and 3D web experiences with GSAP and Three.js.',
  'Worked with 3 designers and 2 backend developers to deliver 10+ responsive pages from design mockups within sprint deadlines.',
]

export const education = [
  ['Master of Computer Applications', 'Chandigarh University', '2023–2025', '7.90 / 10'],
  ['B.Sc. Information Technology', 'Mumbai University', '2021–2023', '8.30 / 10'],
  ['Senior Secondary (XII), Science', 'St. Anne’s Convent High School', '2019', '69.38%'],
]
