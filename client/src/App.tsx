import { useState, useEffect } from 'react'
import Catalog from './features/catalog/Catalog'
import Product from './type/Product'
import axios from 'axios'
import { Container } from 'react-bootstrap'
import BasicNavbar from './ui/BasicNavbar'
import ProductForm from './features/product/ProductForm'

function App() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function getProduct() {
      const res = await axios.get<Product[]>('/api/products/')
      setProducts(res.data)
    }

    getProduct().catch((error) => console.log(error))
  }, [])

  return (
    <>
      <BasicNavbar />
      <Container className='mt-3'>
        <ProductForm />
        <Catalog products={products} />
      </Container>
    </>
  )
}

export default App
