import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import './styles/index.css'
import { AppRoutes } from './app/AppRoutes'
import { WorkflowProvider } from './workflow/WorkflowContext'

/**
 * BrowserRouter for normal dev/preview serving; HashRouter only when
 * packaging the preview as a single static file (VITE_ROUTER=hash).
 */
const Router = import.meta.env.VITE_ROUTER === 'hash' ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <WorkflowProvider>
        <AppRoutes />
      </WorkflowProvider>
    </Router>
  </StrictMode>,
)
