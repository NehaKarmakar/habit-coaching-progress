
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { LoadingProvider } from './contexts/loadingContext.jsx'
import { Provider } from 'react-redux'
import store from './store.jsx'
 console.log(store.getState())
 store.subscribe( () => {
  console.log(store.getState())
 })
createRoot(document.getElementById('root')).render(
  <BrowserRouter> 
  <AuthProvider> 
    <LoadingProvider>
    <Provider store= {store}>
      <App />
  
  </Provider>
  </LoadingProvider>
  </AuthProvider> 
  </BrowserRouter>
    
 
)
