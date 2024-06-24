import { useState, useContext } from 'react'
import { BasketType } from '../../type/Basket'
import Table from 'react-bootstrap/Table'
import axios from 'axios'
import { Plus, Dash } from 'react-bootstrap-icons'
import { StoreContext } from '../../context/StoreContext'
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  IconButton
} from '@mui/material'
import { blue } from '@mui/material/colors'

function Basket() {
  const { basket, removeItem, setBasket, updateItem } = useContext(StoreContext)
  const [loading, setLoading] = useState(false)

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    try {
      if (quantity <= 0) {
        return
      }
      const res = await axios.put<BasketType>(`/api/baskets?productId=${productId}&quantity=${quantity}`)
      updateItem(productId, quantity)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteBasket = async (productId: number) => {
    try {
      const res = await axios.delete<BasketType>(`/api/baskets?productId=${productId}`)
      setBasket(res.data)
      removeItem(productId)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Paper sx={{ backgroundColor: blue[500], marginBottom: 3 }}>
        <Typography paddingTop={3} variant='h4' align={'center'} height={100} color={'white'}>
          Cart items
        </Typography>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Product detail</TableCell>
              <TableCell width={'15%'}>Quantity</TableCell>
              <TableCell width={'10%'}>Unit price</TableCell>
              <TableCell width={'10%'}>Sub total</TableCell>
              <TableCell width={'5%'}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket &&
              basket.basketItems.map((item, idx) => (
                <TableRow key={item.productId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Typography>{idx + 1}</Typography>
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <img
                      style={{ height: 200, objectFit: 'cover' }}
                      src={`http://localhost:8080/api/file/image/${item.imageUrl}`}
                    ></img>
                  </TableCell>
                  <TableCell>
                    <Typography variant='h6'>Name: {item.name}</Typography>
                    <Typography variant='body2'>Category: {item.category}</Typography>
                    <Typography variant='body2'>Brand: {item.brand}</Typography>
                  </TableCell>
                  <TableCell align='cebter'>
                    <IconButton
                      sx={{ marginRight: 1 }}
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Dash size={20} />
                    </IconButton>
                    {item.quantity}
                    <IconButton
                      sx={{ marginLeft: 1 }}
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus size={20} />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2'>{item.unitPrice}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2'>${(item.quantity * item.unitPrice).toFixed(2)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleDeleteBasket(item.productId)}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
            {!basket && (
              <TableRow>
                <TableCell colSpan={7} className='text-center'>
                  No item in basket
                </TableCell>
              </TableRow>
            )}
            {basket && (
              <TableRow>
                <TableCell colSpan={4}></TableCell>
                <TableCell>Total</TableCell>
                <TableCell>
                  ${basket.basketItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0).toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Basket
