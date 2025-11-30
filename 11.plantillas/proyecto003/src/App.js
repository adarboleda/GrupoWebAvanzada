import { useFetch } from './hook/useFetch';
import { getProducts } from './services/productService';
import ProductList from './components/products/ProductList';
import Loading from './components/products/Loading';
import './styles/styles.css';

function App() {
  const { data: products, loading, error } = useFetch(getProducts);
  return (
    <div className="container">
      <h1>Tienda virtual de productos...</h1>
      <p>Bienvenido a la tiendita...</p>
      {loading && <Loading />}
      {error && <p className="error">{error}</p>}
      {!loading && !error && <ProductList products={products} />}
    </div>
  );
}

export default App;
