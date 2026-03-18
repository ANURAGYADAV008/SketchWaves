import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Provider} from "react-redux"
import './index.css'
import App from './App.jsx'
import appStore from './Utils/Appstore.js'

createRoot(document.getElementById('root')).render(
   <Provider store={appStore}>
    <App/>
   </Provider>
  
)
