const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

// Importar los routers de productos y carritos
const productsRouter = require('./routers/products');
const cartsRouter = require('./routers/carts');

// Usar los routers en las rutas correspondientes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Configuración de la raíz del servidor (puede ser una página de inicio, por ejemplo)
app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi servidor!');
});

// Manejo de errores para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores para otros tipos de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
