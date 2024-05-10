import Product from '../../Product'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

export default function Catalog({product} : Product) {
  return (
      <Card style={{ width: '18rem' }}>
        <Card.Img variant='top' src={`http://localhost:8080/api/file/image/${product.imageUrl}`} />
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>{product.description}</Card.Text>
          <Button variant='primary'>${product.unitPrice}</Button>
        </Card.Body>
      </Card>
  )
}
