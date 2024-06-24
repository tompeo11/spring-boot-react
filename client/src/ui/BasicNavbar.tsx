import { Button, Switch } from '@mui/material'
import React, { useEffect } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link, NavLink } from 'react-router-dom'
import '../ui/BasicNavbar.css'
import Badge from 'react-bootstrap/Badge'
import { useDispatch, useSelector } from 'react-redux'
import { setBasketItem } from '../features/basket/basketSlice'
import Cookies from 'js-cookie'
import axios, { AxiosResponse } from 'axios'
import { FaCartShopping } from 'react-icons/fa6'
import { FaHouseChimney } from 'react-icons/fa6'

interface Props {
  darkMode: boolean
  onSetDarkMode: (isDark: boolean) => void
}

function BasicNavbar(props: Props) {
  // const { basket } = React.useContext(StoreContext)
  const dispatch = useDispatch()
  const basket = useSelector((state) => state.basket.basket)
  const itemCount = basket?.basketItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onSetDarkMode(event.target.checked)
  }

  useEffect(() => {
    const buyerId = Cookies.get('buyerId')
    if (buyerId) {
      axios
        .get('/api/baskets')
        .then((response: AxiosResponse) => dispatch(setBasketItem(response.data)))
        .catch((err) => console.log(err))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [dispatch])

  return (
    <Navbar expand='lg' className='bg-body-secondary px-3'>
      <Navbar.Brand href='/' className='fw-bold '>
        <FaHouseChimney />
        My shop
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='me-auto'>
          <NavLink className='me-3 text-decoration-none ' to={'/'}>
            Home
          </NavLink>
          <NavLink className='me-3 text-decoration-none ' to={'/contact'}>
            Contact
          </NavLink>
          <NavLink className='me-3 text-decoration-none ' to={'/about'}>
            About
          </NavLink>
          <NavLink className='me-3 text-decoration-none ' to={'/products'}>
            Products
          </NavLink>
        </Nav>
      </Navbar.Collapse>
      <Link to={'/basket'} className='position-relative me-2'>
        <FaCartShopping size={30} />
        <Badge bg='secondary' className='position-absolute' style={{ top: -5, right: -15, borderRadius: 100 }}>
          {itemCount}
        </Badge>
      </Link>

      <Switch checked={props.darkMode} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />

      <Link>
        <Button>Login</Button>
        <Button>Register</Button>
      </Link>
    </Navbar>
  )
}

export default BasicNavbar
