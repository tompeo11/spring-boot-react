import { AlertTitle, Button, ButtonGroup, Container, Typography } from '@mui/material'
import axios from 'axios'
import { useState } from 'react'

export default function AboutPage() {
  const [validationErrors, setValidationErrors] = useState<String[]>([])

  const config = {
    headers: { 'content-type': 'application/json' }
  }

  const handleValidateError = async () => {
    try {
      const res = await axios.post('/api/buggy/validate-error', { name: 'e', email: 'abc' })
      console.log(res)
    } catch (error) {
      setValidationErrors(error)
    }
  }

  const handle404Error = async () => {
    try {
      const res = await axios.get('/api/buggy/404')
      console.log(res)
    } catch (error) {
      setValidationErrors(error)
    }
  }

  const handle500Error = async () => {
    try {
      const res = await axios.get('/api/buggy/500')
      console.log(res)
    } catch (error) {
      setValidationErrors(error)
    }
  }

  return (
    <Container>
      <Typography gutterBottom variant='h2'>
        Testing Error message
      </Typography>

      <ButtonGroup fullWidth>
        <Button variant='contained' onClick={handleValidateError}>
          Test Validation Error
        </Button>

        <Button variant='contained' onClick={handle404Error}>
          Test Error 404
        </Button>

        <Button variant='contained' onClick={handle500Error}>
          Test Error 500
        </Button>
      </ButtonGroup>

      {validationErrors.length > 0 && <AlertTitle>Validation Error</AlertTitle>}
    </Container>
  )
}
