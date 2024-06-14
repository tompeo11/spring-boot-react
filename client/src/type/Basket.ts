import { BasketItem } from "./BasketItem"

export interface BasketType {
    id: number
    buyerId: string
    basketItems: BasketItem[]
  }