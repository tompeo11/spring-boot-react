import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchCount } from './counterAPI'

export interface catalogSlice {
  value: number
  status: 'idle' | 'loading' | 'fail'
}

const initialState: catalogSlice = {
  value: 0,
  status: 'idle'
}

export const incrementAsync = createAsyncThunk('counter/fetchCount', async (amount: number) => {
  const res = await fetchCount(amount)
  return res.data
})


export const fetchProductByIdThunk = createAsyncThunk('counter/fetchCount', async (amount: number) => {
    const res = await fetchCount(amount)
    return res.data
  })

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByNumber: (state, action: PayloadAction) => {
      state.value += action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.value += action.payload
        state.status = 'idle'
      })
      .addCase(incrementAsync.rejected, (state) => {
        state.status = 'fail'
      })

    builder.addCase(fetchProductByIdThunk.pending, (state, action) => {
        state.status = 'loadingFetchProductsById'
    })
    builder.addCase(fetchProductByIdThunk.fulfilled, (state) => {
        state.status = 'idle'
        state.productLoad = true
        productAdapter.upsertOne(state, action.payload)
    })
    builder.addCase(fetchProductByIdThunk.rejected, (state) => {
        state.status = 'loadingFetchProductsById'
    })
  }
})

export const { increment, decrement, incrementByNumber } = counterSlice.actions
export default counterSlice.reducer
