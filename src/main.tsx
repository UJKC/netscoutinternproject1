import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Theme } from "@radix-ui/themes";

// Get the root element
const rootElement = document.getElementById('root') as HTMLElement

// Create the root and render the app
const root = ReactDOM.createRoot(rootElement)
root.render(
  <React.StrictMode>
    <Theme>
      <App />
    </Theme>
  </React.StrictMode>
)
