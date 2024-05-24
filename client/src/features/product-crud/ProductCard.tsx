import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import Product from '../../type/Product'

interface Props {
  product: Product
}

export default function ProductCard(props: Props) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component='img'
          height='140'
          image='/static/images/cards/contemplative-reptile.jpg'
          alt='green iguana'
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='div'>
            {props.product.name}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {props.product.description}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {props.product.unitPrice}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size='small' color='primary'>
          Add to cart
        </Button>
        <Button size='small' color='primary'>
          View
        </Button>
      </CardActions>
    </Card>
  )
}
