import express from 'express';
import serverless from 'serverless-http';
import { db } from '../../src/db/index.js';
import { pedidos, pedidoItems } from '../../src/db/schema.js';
import { eq, desc } from 'drizzle-orm';

const app = express();
app.use(express.json());

// Endpoint para crear un nuevo pedido
app.post('/api/pedidos', async (req, res) => {
  // Log para debugging
  console.log('POST /api/pedidos - Body recibido:', JSON.stringify(req.body, null, 2));
  
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

    // Convertir valores numéricos a formato decimal correcto
    const formatearDecimal = (valor) => {
      const num = parseFloat(valor) || 0;
      return num.toFixed(2);
    };

    // Paso 1: Insertar el pedido principal usando Drizzle ORM
    const [nuevoPedido] = await db.insert(pedidos).values({
      nombre: datosCliente.nombre,
      email: datosCliente.email,
      telefono: datosCliente.telefono || null,
      direccion: datosCliente.direccion,
      apartamento: datosCliente.apartamento || null,
      ciudad: datosCliente.ciudad,
      estado: datosCliente.estado,
      codigoPostal: datosCliente.codigoPostal,
      metodoPago: metodoPago,
      metodoEnvio: metodoEnvio,
      subtotal: formatearDecimal(subtotal),
      costoEnvio: formatearDecimal(costoEnvio),
      impuesto: formatearDecimal(impuesto),
      total: formatearDecimal(total),
    }).returning({ id: pedidos.id });
    
    const pedidoId = nuevoPedido.id;
    console.log('Pedido creado con ID:', pedidoId);

    // Paso 2: Insertar los items del carrito
    const itemsParaInsertar = carrito.map(item => ({
      pedidoId: pedidoId,
      nombreProducto: item.name || item.title || 'Producto sin nombre',
      precio: formatearDecimal(item.price || 0),
      cantidad: parseInt(item.cantidad || item.quantity || 1),
    }));

    await db.insert(pedidoItems).values(itemsParaInsertar);

    console.log(`${carrito.length} items insertados para pedido ${pedidoId}`);

    // Respuesta exitosa
    res.status(201).json({ 
      status: true, 
      pedidoId: pedidoId,
      mensaje: 'Pedido creado exitosamente'
    });

  } catch (error) {
    console.error('Error al crear pedido:', error);
    console.error('Stack trace:', error.stack);
    console.error('Datos recibidos:', JSON.stringify(req.body, null, 2));
    res.status(500).json({ 
      status: false, 
      error: error.message || 'Error al procesar el pedido' 
    });
  }
});

// Endpoint opcional para listar todos los pedidos (debe ir ANTES del endpoint con :id)
app.get('/api/pedidos', async (req, res) => {
  try {
    // Obtener todos los pedidos con sus items usando Drizzle ORM
    const todosPedidos = await db.query.pedidos.findMany({
      with: {
        items: true,
      },
      orderBy: [desc(pedidos.createdAt)],
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

// Endpoint opcional para obtener un pedido por ID (debe ir DESPUÉS del endpoint general)
app.get('/api/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pedidoId = parseInt(id);
    
    // Buscar el pedido con sus items usando Drizzle ORM
    const pedido = await db.query.pedidos.findFirst({
      where: eq(pedidos.id, pedidoId),
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
      pedido: pedido
    });

  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ 
      status: false, 
      error: error.message 
    });
  }
});

// Manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    status: false, 
    error: 'Endpoint no encontrado' 
  });
});

// Exportar el handler para Netlify Functions
export const handler = serverless(app);
