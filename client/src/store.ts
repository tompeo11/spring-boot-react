import { configureStore } from "@reduxjs/toolkit";
import counterReducer from './counter/counterSlice'
import basketReducer from './features/basket/basketSlice'
import { catalogSlice } from "./features/catalog/catalogSlice";


export const store = configureStore({
    reducer: {
        counter: counterReducer,
        basket: basketReducer,
        catalog: catalogSlice.reducer
    }
})