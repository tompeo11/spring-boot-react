import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Product from '../../type/Product'
import { useDispatch } from 'react-redux'
import { setBasketItem } from '../basket/basketSlice'
import { Button, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material'

export default function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null)
  const params = useParams()
  const id = params.productId

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const handleAddItem = (producId: number) => {
    setLoading(true)
    axios
      .post(`/api/baskets?productId=${producId}&quantity=1`)
      .then((response: AxiosResponse) => dispatch(setBasketItem(response.data)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false))
  }

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
    <Grid container spacing={6}>
      <Grid item xs={4}>
        <img src={`http://localhost:8080/api/file/image/${product.imageUrl}`} alt={`${product.name}`} />
      </Grid>
      <Grid item xs={8}>
        <Typography variant='h3'>{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant='h4' color='secondary' sx={{ mb: 4 }}>
          ${product.unitPrice.toFixed(2)}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.categoryName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Author</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity in stock</TableCell>
                <TableCell>{product.unitsInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant='contained' onClick={() => navigate(-1)}>
          Go back
        </Button>
      </Grid>
    </Grid>
  )
}
