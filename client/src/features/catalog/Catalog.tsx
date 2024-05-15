import { Col, Row } from 'react-bootstrap'
import Product from '../../type/Product'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

type CatalogProps = {
  products: Product[]
}

export default function Catalog({ products }: CatalogProps) {
  return (
    <Row xs={2} md={4} className='g-4'>
      {products.map((product, idx) => (
        <Col key={idx}>
          <Card>
            <Card.Img variant='top' src={`http://localhost:8080/api/file/image/${product.imageUrl}`} />
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>{product.description}</Card.Text>
              <Button variant='primary'>${product.unitPrice}</Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  )
}
