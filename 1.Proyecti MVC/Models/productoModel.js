//clase producto 
class Producto{
    constructor(id, nombre, precio, categoria){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
    }
}
//clase que mepermite almacenar los productos
class ProductoModel{
static productos = [
    new Producto(1,"Zapato",1500,"Calzado"),
    new Producto(2,"Camisa",2500,"Ropa"),
    new Producto(3,"Pantalón",3500,"Ropa"),
    new Producto(4,"Jacket",4500,"Ropa"),
    new Producto(5,"Tenis",5500,"Calzado"),
];

//metodo para obtener todos los productos
static obtenerProductos(){
    return this.productos;
}
//buscar id 
static buscarPorId(id){
    return this.productos.find((p)=> p.id == parseInt(id)  );
}
//agegar producto
static agregarProducto(nombre, precio, categoria){
const nuevo=new Producto(
}