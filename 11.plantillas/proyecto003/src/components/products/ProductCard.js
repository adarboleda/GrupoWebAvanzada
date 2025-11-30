import '../../styles/styles.css';

function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.thumbnail} alt={product.title} />

      <h2>{product.title}</h2>

      <p>Precio: ${product.price}</p>
    </div>
  );
}

export default ProductCard;
