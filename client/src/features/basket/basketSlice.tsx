import { createSlice } from '@reduxjs/toolkit'
import { BasketType } from '../../type/Basket'

export interface BasketState {
  basket: BasketType
  status: string
}

const initialState: BasketState = {
  basket: {
    id: 0,
    buyerId: '',
    basketItems: []
  },
  status: 'idle'
}

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    updateBasketItem: (state, action) => {
      //payload = {productId, quantity}
      if (!action.payload) return

      const basketItems = [...state.basket.basketItems]
      const itemIndex = basketItems.findIndex((i) => i.productId === action.payload.productId)

      basketItems[itemIndex].quantity = action.payload.quantity
    },
    removeBasketItem: (state, action) => {
      //payload = productId
      if (!action.payload) return

      const basketItems = [...state.basket.basketItems]
      const itemIndex = basketItems.findIndex((i) => i.productId === action.payload)

      basketItems.splice(itemIndex, 1)
    },
    setBasketItem: (state, action) => {
      state.basket = action.payload
    },
    setBuyerId: (state, action) => {
      state.basket.buyerId = action.payload
    }
  }
})

export const { updateBasketItem, removeBasketItem, setBasketItem, setBuyerId } = basketSlice.actions
export default basketSlice.reducer
