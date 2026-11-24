import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/manrope'
import './styles.css'
import './premium.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}><App /></BrowserRouter>,
)
