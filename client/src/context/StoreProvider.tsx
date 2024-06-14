import { useEffect, useState } from 'react'
import { StoreContext } from './StoreContext'
import { BasketType } from '../type/Basket'
import axios, { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

export function StoreProvider(props: any) {
  const [basket, setBasket] = useState<BasketType | null>(null)

  const removeItem = (productId: number) => {
    if (!basket) {
      return
    }

    const basketItems = [...basket.basketItems]
    const itemIndex = basketItems.findIndex((i) => i.productId === productId)

    basketItems.splice(itemIndex, 1)

    setBasket((prevState) => {
      return { ...prevState, basketItems }
    })
  }

  const updateItem = (productId: number, quantity: number) => {
    if (!basket) {
      return
    }

    const basketItems = [...basket.basketItems]
    const itemIndex = basketItems.findIndex((i) => i.productId === productId)

    basketItems[itemIndex].quantity = quantity

    setBasket((prevState) => {
      return { ...prevState, basketItems }
    })
  }

  useEffect(() => {
    const buyerId = Cookies.get('buyerId')
    console.log(buyerId)
    if (buyerId) {
      axios
        .get('/api/baskets')
        .then((response: AxiosResponse) => setBasket(response.data))
        .catch((err) => console.log(err))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [setBasket])

  return (
    <StoreContext.Provider
      value={{
        basket: basket,
        setBasket: setBasket,
        removeItem: removeItem,
        updateItem: updateItem
      }}
    >
      {props.children}
    </StoreContext.Provider>
  )
}
