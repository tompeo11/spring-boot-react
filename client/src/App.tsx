const products = [
  {name: 'product 1', price: 123},
  {name: 'product 2', price: 456},
];

function App() {
  return (
    <div>
      <ul>
        {products.map((product, index) => {
          return <li key={index}>{product.name} {product.price}</li>
        })}
      </ul>
    </div>
  );
}

export default App