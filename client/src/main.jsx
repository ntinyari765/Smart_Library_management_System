import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { UserProvider } from "./context/UserContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <UserProvider>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </UserProvider>
  </StrictMode>
);
