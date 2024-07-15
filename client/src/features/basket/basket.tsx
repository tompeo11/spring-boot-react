import { useState, useContext } from 'react'
import { BasketType } from '../../type/Basket'
import Table from 'react-bootstrap/Table'
import axios from 'axios'
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Button
} from '@mui/material'
import Modal from 'react-bootstrap/Modal'
import { blue } from '@mui/material/colors'
import { removeBasketItem, setBasketItem, updateBasketItem } from './basketSlice'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosAddCircle } from 'react-icons/io'
import { IoIosRemoveCircle } from 'react-icons/io'

function Basket() {
  const basket = useSelector((state) => state.basket.basket)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    try {
      if (quantity <= 0) {
        return
      }
      const res = await axios.put<BasketType>(`/api/baskets?productId=${productId}&quantity=${quantity}`)
      dispatch(updateBasketItem({ productId, quantity }))
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteBasket = async (productId: number) => {
    try {
      const res = await axios.delete<BasketType>(`/api/baskets?productId=${productId}`)
      dispatch(removeBasketItem(productId))
      dispatch(setBasketItem(res.data))
      setShow(false)
    } catch (error) {
      console.log(error)
    }
  }

  const [show, setShow] = useState(false)
  const [deleteId, setDeleteId] = useState(0)

  const handleClose = () => setShow(false)
  const handleShow = (productId: number) => {
    setShow(true)
    setDeleteId(productId)
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
                    <Button
                      variant='contained'
                      sx={{ marginRight: 1, borderRadius: 100 }}
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                    >
                      <IoIosRemoveCircle />
                    </Button>
                    {item.quantity}
                    <Button
                      variant='contained'
                      sx={{ marginLeft: 1, borderRadius: 100 }}
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                    >
                      <IoIosAddCircle />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2'>{item.unitPrice}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2'>${(item.quantity * item.unitPrice).toFixed(2)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Button variant='contained' className='btn btn-warning' onClick={() => handleShow(item.productId)}>
                      Remove
                    </Button>
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure confirm delete item!</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='danger' onClick={() => handleDeleteBasket(deleteId)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Basket
