import ProductCard from "./ProductCard";

function ProductList({ productos }) {
    return (
        <div className="product-grid">
            {productos.map(producto => (
                <ProductCard key={producto.id} producto={producto} />
            ))}
        </div>
    );
}

export default ProductList;