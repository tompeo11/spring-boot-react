import { Switch } from '@mui/material'
import React from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link, NavLink } from 'react-router-dom'
import '../ui/BasicNavbar.css'
import { House, Cart } from 'react-bootstrap-icons'
import Badge from 'react-bootstrap/Badge'

interface Props {
  darkMode: boolean
  onSetDarkMode: (isDark: boolean) => void
}

function BasicNavbar(props: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onSetDarkMode(event.target.checked)
  }

  return (
    <Navbar expand='lg' className='bg-body-secondary px-3'>
      <Navbar.Brand href='/' className='fw-bold '>
        <House />
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
        <Cart size={30} />
        <Badge bg='secondary' className='position-absolute' style={{ top: -5, right: -10, borderRadius: 100 }}>
          1
        </Badge>
      </Link>

      <Switch checked={props.darkMode} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />
    </Navbar>
  )
}

export default BasicNavbar
