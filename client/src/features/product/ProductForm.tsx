import { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Category from '../../type/Category'
import axios from 'axios'
import { Button } from 'react-bootstrap'

export default function ProductForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [brand, setBrand] = useState('')
  const [unitsInStock, setUnitsInStock] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState({ preview: '', file: '' })
  const [categoryList, setCategoryList] = useState<Category[]>([])

  const handleFileUpload = (event: any) => {
    setImage({
      preview: URL.createObjectURL(event.target.files[0]),
      file: event.target.files[0]
    })
  }

  useEffect(() => {
    async function getCategory() {
      const res = await axios.get<Category[]>('http://localhost:8080/api/categories')
      setCategoryList(res.data)
    }

    getCategory().catch((error) => console.log(error))
  }, [])

  const submitHandle = (event: any) => {
    event.preventDefault()

    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    }

    const formData = new FormData()

    formData.append('name', name)
    formData.append('description', description)
    formData.append('unitPrice', unitPrice)
    formData.append('brand', brand)
    formData.append('unitsInStock', unitsInStock)
    formData.append('categoryName', category)
    formData.append('image', image.file)

    axios
      .post('http://localhost:8080/api/products', formData, config)
      .then((res) => {
        formData.delete('name')
        formData.delete('description')
        formData.delete('unitPrice')
        formData.delete('brand')
        formData.delete('unitsInStock')
        formData.delete('category')
        formData.delete('image')
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setName('')
        setDescription('')
        setUnitPrice('')
        setBrand('')
        setUnitsInStock('')
        setCategory('')
        setImage({ preview: '', file: '' })
      })
  }

  return (
    <>
      <Form onSubmit={submitHandle}>
        <Form.Group className='mb-3' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control type='text' value={name} placeholder='Name' onChange={(name) => setName(name.target.value)} />
        </Form.Group>
        <Form.Group className='mb-3' controlId='description'>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as='textarea'
            row={3}
            value={description}
            placeholder='Description'
            onChange={(description) => setDescription(description.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='unitPrice'>
          <Form.Label>Unit price</Form.Label>
          <Form.Control
            type='text'
            value={unitPrice}
            placeholder='Unit price'
            onChange={(unitPrice) => setUnitPrice(unitPrice.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='brand'>
          <Form.Label>Brand</Form.Label>
          <Form.Control
            type='text'
            value={brand}
            placeholder='Brand'
            onChange={(brand) => setBrand(brand.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='unitsInStock'>
          <Form.Label>Units in stock</Form.Label>
          <Form.Control
            type='number'
            value={unitsInStock}
            placeholder='Units in stock'
            onChange={(unitsInStock) => setUnitsInStock(unitsInStock.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='category'>
          <Form.Label>Category</Form.Label>
          <Form.Select onChange={(e) => setCategory(e.target.value)}>
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
        <Button type='submit' variant='primary'>
          Submit
        </Button>
      </Form>
      <div>{image.preview && <img src={image.preview} style={{ width: '18rem' }} alt='productImage' />}</div>
    </>
  )
}
