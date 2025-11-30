const API_URL = 'https://dummyjson.com/products';

export async function getProducts() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al cargar los productos');
  }
  const data = await response.json();
  return data.products;
}
