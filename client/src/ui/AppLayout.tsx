import React, { useState } from 'react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import BasicNavbar from './BasicNavbar'
import { Container } from 'react-bootstrap'

function AppLayout() {
  const [darkMode, setDarkMode] = useState(false)

  const paletteMode = darkMode ? 'dark' : 'light'

  const theme = createTheme({
    palette: {
      mode: paletteMode
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <BasicNavbar darkMode={darkMode} onSetDarkMode={setDarkMode} />
      <Container className='mt-3'>
        <Outlet />
      </Container>
      <footer style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p>&copy; 2024 My Shop</p>
      </footer>
    </ThemeProvider>
  )
}

export default AppLayout
