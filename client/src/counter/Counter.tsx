import { Button } from '@mui/material'
import styles from './counnter.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { increment, decrement, incrementByNumber, incrementAsync } from './counterSlice'
import { useState } from 'react'

export default function Counter() {
  const [number, setNumber] = useState(0)

  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()
  const handleIncrement = () => {
    dispatch(increment())
  }

  const handleDecrement = () => {
    dispatch(decrement())
  }

  const handleIncrementByNumber = () => {
    if (!number) return
    const intNumber = parseInt(number)
    dispatch(incrementByNumber(intNumber))
    setNumber(0)
  }

  const handleIncrementAsync = () => {
    if (!number) return
    const intNumber = parseInt(number)
    dispatch(incrementAsync(intNumber))
    setNumber(0)
  }

  return (
    <>
      <div className={styles.row}>
        <Button className={styles.button} aria-label='Decrement value' onClick={handleDecrement}>
          -
        </Button>
        <span className={styles.value}>{count}</span>
        <Button className={styles.button} aria-label='Increment value' onClick={handleIncrement}>
          +
        </Button>
      </div>

      <div className={styles.row}>
        <input
          type='number'
          className={styles.textbox}
          value={number}
          onChange={(event) => setNumber(event.target.value)}
        ></input>
        <Button className={styles.button} aria-label='Submit value' onClick={handleIncrementByNumber}>
          Submit
        </Button>
        <Button className={styles.asyncButton} onClick={handleIncrementAsync}>
          Add async
        </Button>
      </div>
    </>
  )
}
