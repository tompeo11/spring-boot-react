import Product from '../../type/Product'
import { Col, Row } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import { Link } from 'react-router-dom'

type props = {
  products: Product[]
}

export default function ProductPage({ products }: props) {
  return (
    <div className='d-flex flex-column '>
      <div className='d-flex'>
        <h1>List products</h1>
        <Link className='btn btn-primary col-2 ms-auto my-3' to={'/products/new'}>
          Add new product
        </Link>
      </div>

      <Row xs={2} md={4} className='g-4'>
        {products.map((product, idx) => (
          <Col key={idx}>
            <Card>
              <Card.Img
                variant='top'
                style={{ height: '240px', objectFit: 'cover' }}
                src={`http://localhost:8080/api/file/image/${product.imageUrl}`}
              />
              <Card.Body>
                <Card.Title className='name'>{product.name}</Card.Title>
                <Card.Text className='description'>{product.description}</Card.Text>
                <div className='d-flex justify-content-between '>
                  <Link className='btn btn-primary ' to={'/products/' + product.id}>
                    View
                  </Link>
                  <Link className='btn btn-primary' to={'/products/' + product.id}>
                    Add to cart
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
