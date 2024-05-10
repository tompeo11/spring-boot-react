import { useState, useEffect } from 'react'
import Catalog from './features/catalog/Catalog'
import Product from './Product'

function App() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function getProduct() {
      const res = await fetch('http://localhost:8080/api/products/')
      const data = await res.json()
      setProducts(data)
    }

    getProduct()
  }, [])

  return (
    <div className='row'>
      
        {products.map((product) => (
          <div className='col-md-3' key={product.id}>
            <Catalog product={product} />
          </div>
        ))}
    </div>
  )
}

export default App
