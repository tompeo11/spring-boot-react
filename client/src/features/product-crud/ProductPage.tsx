import Product from '../../type/Product'
import { Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from './ProductCard'

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    async function getProduct() {
      try {
        setLoading(true)
        const res = await axios.get<Product[]>('/api/products/')
        setProducts(res.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    getProduct()
  }, [])

  return (
    <div className='d-flex flex-column '>
      <div className='d-flex'>
        <h1>List products</h1>
        <Link className='btn btn-primary col-2 ms-auto my-3' to={'/products/new'}>
          Add new product
        </Link>
      </div>

      {loading && 'Loading...'}
      {!loading && (
        <Row xs={2} md={4} className='g-4'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Row>
      )}
    </div>
  )
}
