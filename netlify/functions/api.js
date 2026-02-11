import express from 'express';
import serverless from 'serverless-http';
import { db } from '../../src/db/index.js';
import { pedidos, pedidoItems } from '../../src/db/schema.js';

const app = express();
app.use(express.json());

// Endpoint para crear un nuevo pedido
app.post('/api/pedidos', async (req, res) => {
  try {
    const { 
      datosCliente, 
      metodoPago, 
      metodoEnvio, 
      subtotal, 
      costoEnvio, 
      impuesto, 
      total, 
      carrito 
    } = req.body;

    // Validar que vengan los datos requeridos
    if (!datosCliente || !metodoPago || !metodoEnvio || !carrito) {
      return res.status(400).json({ 
        status: false, 
        error: 'Faltan datos requeridos' 
      });
    }

    // Validar que el carrito no esté vacío
    if (!Array.isArray(carrito) || carrito.length === 0) {
      return res.status(400).json({ 
        status: false, 
        error: 'El carrito está vacío' 
      });
    }

    // Paso 1: Insertar el pedido principal
    const [nuevoPedido] = await db.insert(pedidos).values({
      nombre: datosCliente.nombre,
      email: datosCliente.email,
      telefono: datosCliente.telefono || '',
      direccion: datosCliente.direccion,
      apartamento: datosCliente.apartamento || '',
      ciudad: datosCliente.ciudad,
      estado: datosCliente.estado,
      codigoPostal: datosCliente.codigoPostal,
      metodoPago: metodoPago,
      metodoEnvio: metodoEnvio,
      subtotal: subtotal.toString(),
      costoEnvio: costoEnvio.toString(),
      impuesto: impuesto.toString(),
      total: total.toString(),
    }).returning();

    // Paso 2: Insertar los items del carrito
    const itemsParaInsertar = carrito.map(item => ({
      pedidoId: nuevoPedido.id,
      nombreProducto: item.name || item.title || 'Producto sin nombre',
      precio: (item.price || 0).toString(),
      cantidad: item.cantidad || item.quantity || 1,
    }));

    await db.insert(pedidoItems).values(itemsParaInsertar);

    // Respuesta exitosa
    res.status(201).json({ 
      status: true, 
      pedidoId: nuevoPedido.id,
      mensaje: 'Pedido creado exitosamente'
    });

  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message || 'Error al procesar el pedido' 
    });
  }
});

// Endpoint opcional para obtener un pedido por ID
app.get('/api/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar el pedido con sus items
    const pedido = await db.query.pedidos.findFirst({
      where: (pedidos, { eq }) => eq(pedidos.id, parseInt(id)),
      with: {
        items: true,
      },
    });

    if (!pedido) {
      return res.status(404).json({ 
        status: false, 
        error: 'Pedido no encontrado' 
      });
    }

    res.json({ 
      status: true, 
      pedido 
    });

  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message 
    });
  }
});

// Endpoint opcional para listar todos los pedidos
app.get('/api/pedidos', async (req, res) => {
  try {
    const todosPedidos = await db.query.pedidos.findMany({
      with: {
        items: true,
      },
      orderBy: (pedidos, { desc }) => [desc(pedidos.createdAt)],
    });

    res.json({ 
      status: true, 
      pedidos: todosPedidos 
    });

  } catch (error) {
    console.error('Error al listar pedidos:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message 
    });
  }
});

// Manejar rutas no encontradas (debe ser sin asterisco para Netlify Functions)
app.use((req, res) => {
  res.status(404).json({ 
    status: false, 
    error: 'Endpoint no encontrado' 
  });
});

// Exportar el handler para Netlify Functions
export const handler = serverless(app);
