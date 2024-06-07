import { useEffect, useState } from 'react'
import { Basket } from '../../type/Basket'
import axios from 'axios'

function basket() {
  const [baskets, setBaskets] = useState<Basket>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function getBasket() {
      try {
        setLoading(true)
        const res = await axios.get<Basket>('/api/baskets')
        setBaskets(res.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    getBasket()
  }, [])

  return <div>{baskets.id}</div>
}

export default basket
