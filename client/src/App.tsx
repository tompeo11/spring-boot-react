import { useState, useEffect } from 'react'
import Product from './type/Product'
import axios from 'axios'
import { Container } from 'react-bootstrap'
import BasicNavbar from './ui/BasicNavbar'
import ProductPage from './features/product-crud/ProductPage'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import ProductDetail from './features/catalog/ProductDetail'
import HomePage from './pages/HomePage'
import NotFound from './pages/NotFound'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import Catalog from './features/catalog/Catalog'
import ProductForm from './features/product-crud/ProductForm'
import './index.css'
import { ToastContainer } from 'react-toastify'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [darkMode, setDarkMode] = useState(false)

  const paletteMode = darkMode ? 'dark' : 'light'

  const theme = createTheme({
    palette: {
      mode: paletteMode
    }
  })

  useEffect(() => {
    async function getProduct() {
      const res = await axios.get<Product[]>('/api/products/')
      setProducts(res.data)
    }

    getProduct().catch((error) => console.log(error))
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <BasicNavbar darkMode={darkMode} onSetDarkMode={setDarkMode} />
      <Container className='mt-3'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/catalog' element={<Catalog />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/products' element={<ProductPage products={products} />} />
          <Route path='/products/:productId' element={<ProductDetail />} />
          <Route path='/products/new' element={<ProductForm products={products} />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Container>
      <footer style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p>&copy; 2024 My Shop</p>
      </footer>
    </ThemeProvider>
  )
}

export default App
