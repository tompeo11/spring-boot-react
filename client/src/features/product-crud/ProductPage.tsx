import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import ProductCard from '../catalog/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { store } from '../../store'
import {
  fetchBrandAndCategoryForFilterThunk,
  fetchProductThunk,
  productAdapter,
  setPageNumber,
  setProductParams
} from '../catalog/catalogSlice'
import { FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, TextField } from '@mui/material'
import PaginationComponent from '../../layout/PaginationComponent'
import CheckboxButton from '../../layout/CheckboxButton'

const sortOptions = [
  { value: 'name', label: 'Alphabetical' },
  { value: 'priceAsc', label: 'Price - Low to High' },
  { value: 'priceDesc', label: 'Price - High to Low' }
]

export default function ProductPage() {
  const products = productAdapter.getSelectors().selectAll(store.getState().catalog)
  const dispatch = useDispatch()
  const { productLoad, filtersLoaded, productParams, pagination } = useSelector((state: any) => state.catalog)
  const brands = useSelector((state: any) => state.catalog.brands)
  const categories = useSelector((state: any) => state.catalog.categories)

  useEffect(() => {
    if (!productLoad) {
      store.dispatch(fetchProductThunk())
    }
  }, [productLoad])

  useEffect(() => {
    if (!filtersLoaded) {
      store.dispatch(fetchBrandAndCategoryForFilterThunk())
    }
  }, [filtersLoaded])

  return (
    <div className='d-flex flex-column '>
      <div className='d-flex'>
        <h1>List products</h1>
        <Link className='btn btn-primary col-2 ms-auto my-3' to={'/products/new'}>
          Add new product
        </Link>
      </div>

      {/* {!productLoad && 'Loading...'}
      {productLoad && ( */}
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <Paper sx={{ mb: 2 }}>
            <TextField
              label='Search product'
              variant='outlined'
              fullWidth
              value={productParams.name || ''}
              onChange={(e) => store.dispatch(setProductParams({ name: e.target.value }))}
            />
          </Paper>

          <Paper sx={{ mb: 2, p: 2 }}>
            <FormControl>
              <FormLabel id='radio-buttons'>Sort</FormLabel>
              <RadioGroup
                aria-labelledby='radio-buttons'
                defaultValue='name'
                value={productParams.sort || 'name'}
                onChange={(e) => store.dispatch(setProductParams({ sort: e.target.value }))}
              >
                {sortOptions.map(({ value, label }) => (
                  <FormControlLabel value={value} label={label} key={value} control={<Radio />} />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>
          <Paper sx={{ mb: 2, p: 2 }}>
            <CheckboxButton
              items={categories}
              currentChecked={productParams.categories}
              onChange={(items: string[]) => store.dispatch(setProductParams({ categories: items }))}
            />
          </Paper>
          <Paper sx={{ mb: 2, p: 2 }}>
            <CheckboxButton
              items={brands}
              currentChecked={productParams.brands}
              onChange={(items: string[]) => store.dispatch(setProductParams({ brands: items }))}
            />
          </Paper>
        </Grid>
        <Grid container item xs={9}>
          {products.map((product) => (
            <Grid key={product.id} item xs={4}>
              <ProductCard key={product.id} product={product} />
            </Grid>
          ))}
        </Grid>

        <Grid item xs={3} />

        <Grid item xs={9}>
          <PaginationComponent
            pagination={pagination}
            onPageChange={(page: number) => store.dispatch(setPageNumber({ pageNumber: page }))}
          />
        </Grid>
      </Grid>
      {/* )} */}
    </div>
  )
}
