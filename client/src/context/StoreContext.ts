import { createContext } from 'react'
import { BasketType } from '../type/Basket'

interface StoreContextValue {
    basket: BasketType | null
    setBasket: (basket: BasketType) => void
    removeItem: (productId: number) => void
    updateItem: (productId: number, quantity: number) => void
}


export const StoreContext = createContext<StoreContextValue>({
    basket: null,
    setBasket: (basket: BasketType) => {},
    removeItem: (productId: number) => {},
    updateItem: (productId: number, quantity: number) => {}
});