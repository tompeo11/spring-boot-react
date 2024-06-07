import { useState } from 'react'
import { Container } from 'react-bootstrap'
import BasicNavbar from './ui/BasicNavbar'
import ProductPage from './features/product-crud/ProductPage'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import ProductDetail from './features/catalog/ProductDetail'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import Catalog from './features/catalog/Catalog'
import ProductForm from './features/product-crud/ProductForm'
import './index.css'
import { ToastContainer } from 'react-toastify'
import { AxiosInterceptor } from './interceptor/AxiosInterceptor'
import { BrowserRouter } from 'react-router-dom'
import ServerError from './features/error/ServerError'
import NotFound from './features/error/NotFound'
import Basket from './features/basket/basket'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const paletteMode = darkMode ? 'dark' : 'light'

  const theme = createTheme({
    palette: {
      mode: paletteMode
    }
  })

  return (
    <BrowserRouter>
      <AxiosInterceptor>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastContainer />
          <BasicNavbar darkMode={darkMode} onSetDarkMode={setDarkMode} />
          <Container className='mt-3'>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/basket' element={<Basket />} />
              <Route path='/catalog' element={<Catalog />} />
              <Route path='/about' element={<AboutPage />} />
              <Route path='/contact' element={<ContactPage />} />
              <Route path='/products' element={<ProductPage />} />
              <Route path='/products/:productId' element={<ProductDetail />} />
              <Route path='/products/new' element={<ProductForm />} />
              <Route path='/server-error' element={<ServerError />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </Container>
          <footer style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p>&copy; 2024 My Shop</p>
          </footer>
        </ThemeProvider>
      </AxiosInterceptor>
    </BrowserRouter>
  )
}

export default App
