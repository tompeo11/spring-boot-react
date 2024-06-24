import ProductPage from './features/product-crud/ProductPage'
import { Route, Routes } from 'react-router-dom'
import ProductDetail from './features/catalog/ProductDetail'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import Catalog from './features/catalog/Catalog'
import ProductForm from './features/product-crud/ProductForm'
import './index.css'
import { AxiosInterceptor } from './interceptor/AxiosInterceptor'
import { BrowserRouter } from 'react-router-dom'
import ServerError from './features/error/ServerError'
import NotFound from './features/error/NotFound'
import Basket from './features/basket/Basket'
import { StoreProvider } from './context/StoreProvider'
import AppLayout from './ui/AppLayout'
import { Provider } from 'react-redux'
import { store } from './store'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {/* <StoreProvider> */}
        <AxiosInterceptor>
          <Routes>
            <Route element={<AppLayout />}>
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
            </Route>
          </Routes>
        </AxiosInterceptor>
        {/* </StoreProvider> */}
      </BrowserRouter>
    </Provider>
  )
}

export default App
