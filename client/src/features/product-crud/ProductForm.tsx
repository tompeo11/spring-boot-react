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
    <Row>
      <Col xs={9}>
        <h1>Product form</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className='mb-3' controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control type='text' placeholder='Name' {...register('name')} isInvalid={!!errors.name} />
            {errors.name && <span className='text-danger '>{errors.name.message}</span>}
          </Form.Group>
          <Form.Group className='mb-3' controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              row={3}
              placeholder='Description'
              {...register('description')}
              isInvalid={!!errors.description}
            />
            {errors.description && <span className='text-danger '>{errors.description.message}</span>}
          </Form.Group>
          <Form.Group className='mb-3' controlId='unitPrice'>
            <Form.Label>Unit price</Form.Label>
            <Form.Control
              type='number'
              placeholder='Unit price'
              {...register('unitPrice')}
              isInvalid={!!errors.unitPrice}
            />
            {errors.unitPrice && <span className='text-danger '>{errors.unitPrice.message}</span>}
          </Form.Group>
          <Form.Group className='mb-3' controlId='brand'>
            <Form.Label>Brand</Form.Label>
            <Form.Control type='text' placeholder='Brand' {...register('brand')} isInvalid={!!errors.brand} />
            {errors.brand && <span className='text-danger '>{errors.brand.message}</span>}
          </Form.Group>
          <Form.Group className='mb-3' controlId='unitsInStock'>
            <Form.Label>Units in stock</Form.Label>
            <Form.Control
              type='number'
              placeholder='Units in stock'
              {...register('unitsInStock')}
              isInvalid={!!errors.unitsInStock}
            />
            {errors.unitsInStock && <span className='text-danger '>{errors.unitsInStock.message}</span>}
          </Form.Group>
          <Form.Group className='mb-3' controlId='category'>
            <Form.Label>Category</Form.Label>
            <Form.Select {...register('categoryName')}>
              {categoryList.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className='mb-3' controlId='image'>
            <Form.Label>Image</Form.Label>
            <Form.Control type='file' placeholder='Image' onChange={(event) => handleFileUpload(event)} />
          </Form.Group>

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
      </Col>
      <Col xs={3}>
        <h3>Preview image</h3>
        {!image.preview && (
          <img src='https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'></img>
        )}
        <div>{image.preview && <img src={image.preview} style={{ width: '18rem' }} alt='productImage' />}</div>
      </Col>
    </Row>
  )
}
