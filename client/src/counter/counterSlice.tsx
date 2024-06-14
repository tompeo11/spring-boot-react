import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface CounterSlice {
  value: number
  status: 'idle' | 'loading' | 'fail'
}

const initialState: CounterSlice = {
  value: 0,
  status: 'idle'
}

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
  }
})

export const { increment, decrement, incrementByNumber } = counterSlice.actions
export default counterSlice.reducer
