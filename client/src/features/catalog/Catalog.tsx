import { useSelector } from 'react-redux'
import { store } from '../../store'
import { fetchProductThunk, productAdapter } from './catalogSlice'
import { useEffect } from 'react'
import LoadingComponent from '../../layout/LoadingComponent'
import ProductList from './ProductList'

export default function Catalog() {
  const products = productAdapter.getSelectors().selectAll(store.getState().catalog)
  const { productLoad, status } = useSelector((state: any) => state.catalog)

  useEffect(() => {
    if (!productLoad) {
      store.dispatch(fetchProductThunk())
    }
  }, [productLoad])

  if (status.includes('loading')) {
    return <LoadingComponent />
  }

  return <ProductList products={products} />
}
