import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Product from '../../type/Product'
import { Col, Image, Row } from 'react-bootstrap'

export default function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null)

  const params = useParams()

  const id = params.productId

  useEffect(() => {
    async function getProduct() {
      const res = await axios.get<Product>('/api/products/' + id)
      setProduct(res.data)
    }

    getProduct().catch((error) => console.log(error))
  }, [])

  if (!product) {
    return (
      <>
        <h3>Product not found!</h3>
        <Link to={'/products'} className='btn btn-primary '>
          Go back
        </Link>
      </>
    )
  }

  return (
    <>
      <Row>
        <h1>Product details</h1>
        <Col xs={8}>
          <div className='mb-4 '>
            <span>Name: </span>
            {product.categoryName}
          </div>
          <div className='mb-4 '>
            <span>Description: </span>
            {product.description}
          </div>
          <div className='mb-4 '>
            <span>Brand: </span>
            {product.brand}
          </div>
          <div className='mb-4 '>
            <span>Category: </span>
            {product.categoryName}
          </div>
          <div className='mb-4 '>
            <span>Unit price: </span>
            {product.unitPrice}
          </div>
        </Col>
        <Col>
          <Image
            variant='top'
            style={{ height: '500px', width: '375px' }}
            src={`http://localhost:8080/api/file/image/${product.imageUrl}`}
          />
        </Col>
      </Row>
      <Link to={'/products'} className='btn btn-primary '>
        Go back
      </Link>
    </>
  )
}
