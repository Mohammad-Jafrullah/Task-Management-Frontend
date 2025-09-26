import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Store from './components/context/Store.jsx'

createRoot(document.getElementById('root')).render(
  <Store>
    <App />
  </Store>
)