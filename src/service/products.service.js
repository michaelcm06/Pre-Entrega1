import ProductModel from '../Dao/models/Product.js'; // Asegúrate de que la ruta sea correcta

class ProductsService {
  async getProductos() {
    try {
      const productos = await ProductModel.find();
      return productos;
    } catch (error) {
      throw error;
    }
  }

  async getProductoById(id) {
    try {
      const producto = await ProductModel.findById(id);
      return producto;
    } catch (error) {
      throw error;
    }
  }

  async createProducto(nombre, descripcion, precio) {
    try {
      const nuevoProducto = await ProductModel.create({
        nombre,
        descripcion,
        precio,
      });
      return nuevoProducto;
    } catch (error) {
      throw error;
    }
  }

  // Agrega más métodos según sea necesario

}

export default ProductsService;
