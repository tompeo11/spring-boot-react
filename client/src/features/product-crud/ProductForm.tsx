import { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Category from '../../type/Category'
import axios from 'axios'
import { Button, Col, Row, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Zoom, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Grid, MenuItem, TextField, Typography, styled } from '@mui/material'
import { CloudUpload } from 'react-bootstrap-icons'

type FormField = {
  name: string
  description: string
  brand: string
  unitPrice: number
  unitsInStock: number
  categoryName: string
}

export default function ProductForm() {
  const productSchema = yup.object({
    name: yup.string().required('Name is required'),
    description: yup.string().required('Desciption is required'),
    brand: yup.string().required('Brand is required'),
    unitPrice: yup.number().typeError('Units in stock must be a number').positive().required('Unit price is required'),
    unitsInStock: yup
      .number()
      .typeError('Units in stock must be a number')
      .positive()
      .integer()
      .required('Units in stock is required')
  })

  const [image, setImage] = useState({ preview: '', file: '' })
  const [categoryList, setCategoryList] = useState<Category[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormField>({
    resolver: yupResolver(productSchema)
  })

  const handleFileUpload = (event: any) => {
    setImage({
      preview: URL.createObjectURL(event.target.files[0]),
      file: event.target.files[0]
    })
  }

  useEffect(() => {
    async function getCategory() {
      const res = await axios.get<Category[]>('/api/categories')
      setCategoryList(res.data)
    }

    getCategory().catch((error) => console.log(error))
  }, [])

  const onSubmit: SubmitHandler<FormField> = async (data: FormField) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description)
    formData.append('unitPrice', data.unitPrice.toString())
    formData.append('unitsInStock', data.unitsInStock.toString())
    formData.append('brand', data.brand)
    formData.append('categoryName', data.categoryName)
    formData.append('image', image.file)

    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    }

    await axios
      .post('/api/products', formData, config)
      .then(() => {
        toast.success('🦄 Add product success!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Zoom
        })
        reset()
      })
      .catch(() => {
        toast.error('🦄 Add product fail!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Zoom
        })
      })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Grid container columnSpacing={6} rowSpacing={2}>
        <Grid container item xs={8} spacing={2}>
          <Grid item xs={12}>
            <Typography variant='h5'>Product Form</Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Name'
              placeholder='Name of product'
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name')}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Description'
              placeholder='Description of product'
              error={!!errors.description}
              helperText={errors.description?.message}
              {...register('description')}
            />
          </Grid>

          <Grid container item xs={12} spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type='number'
                label='Unit price'
                placeholder='Unit price'
                error={!!errors.unitPrice}
                helperText={errors.unitPrice?.message}
                {...register('unitPrice')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type='number'
                label='Units in stock'
                placeholder='Units in stock'
                error={!!errors.unitsInStock}
                helperText={errors.unitsInStock?.message}
                {...register('unitsInStock')}
              />
            </Grid>
          </Grid>

          <Grid container item xs={6} spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Brand'
                placeholder='Brand'
                error={!!errors.brand}
                helperText={errors.brand?.message}
                {...register('brand')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Category Name'
                select
                error={!!errors.categoryName}
                helperText={errors.categoryName?.message}
                {...register('categoryName')}
              >
                {categoryList.map((category) => (
                  <MenuItem key={category.id} value={category.name} selected={1}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Form.Group className='mb-3' controlId='image'>
              <Form.Label>Upload image</Form.Label>
              <Form.Control type='file' placeholder='Image' onChange={(event) => handleFileUpload(event)} />
            </Form.Group>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h5'>Preview Image</Typography>
          {image.preview && <img src={image.preview} alt='Preview' width='100%' />}
        </Grid>
      </Grid>

      {!isSubmitting && (
        <Button type='submit' variant='primary'>
          Submit
        </Button>
      )}

      {isSubmitting && (
        <Button variant='primary' disabled>
          <Spinner as='span' animation='grow' size='sm' role='status' aria-hidden='true' />
          Loading...
        </Button>
      )}
    </Form>
  )
}
