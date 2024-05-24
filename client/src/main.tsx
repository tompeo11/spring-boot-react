import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/ReactToastify.css'

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    switch (error.response?.status) {
      case 400:
        toast.error(error.response?.data.message, { theme: 'colored;' })
        break

      default:
        toast.error(error.message, { theme: 'dark;' })
        break
    }

    console.log('interceptor is caller')
    return Promise.reject(error)
  }
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
