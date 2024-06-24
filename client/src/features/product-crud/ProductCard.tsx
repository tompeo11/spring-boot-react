import Product from '../../type/Product'
import { Button, Col } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import { useContext, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import { Link } from 'react-router-dom'
import './product.css'
import { StoreContext } from '../../context/StoreContext'
import { useDispatch } from 'react-redux'
import { setBasketItem } from '../basket/basketSlice'

interface Props {
  product: Product
}

export default function ProductCard(props: Props) {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  // const { setBasket } = useContext(StoreContext)
  const handleAddItem = (producId: number) => {
    setLoading(true)
    axios
      .post(`/api/baskets?productId=${producId}&quantity=1`)
      // .then((response: AxiosResponse) => setBasket(response.data))
      .then((response: AxiosResponse) => dispatch(setBasketItem(response.data)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false))
  }

  return (
    <Col>
      <Card>
        <Card.Img
          variant='top'
          style={{ height: '240px', objectFit: 'cover' }}
          src={`http://localhost:8080/api/file/image/${props.product.imageUrl}`}
        />
        <Card.Body>
          <Card.Title id='name' className='name'>
            {props.product.name}
          </Card.Title>
          <Card.Text id='description' className='description'>
            {props.product.description}
          </Card.Text>
          <div className='d-flex justify-content-between '>
            <Link className='btn btn-primary ' to={'/products/' + props.product.id}>
              View
            </Link>
            <Button className='btn btn-primary' onClick={() => handleAddItem(props.product.id)}>
              {loading && 'Adding...'}
              {!loading && 'Add to cart'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}
