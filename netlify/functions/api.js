import express from 'express';
import serverless from 'serverless-http';
import { neon } from '@neondatabase/serverless';

const app = express();
app.use(express.json());

// Crear cliente SQL directo
const sql = neon(process.env.NETLIFY_DATABASE_URL);

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

    // Paso 1: Insertar el pedido principal usando SQL directo
    const queryPedido = `
      INSERT INTO pedidos (
        nombre, email, telefono, direccion, apartamento, 
        ciudad, estado, codigo_postal, metodo_pago, metodo_envio,
        subtotal, costo_envio, impuesto, total
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id
    `;
    
    const resultadoPedido = await sql(queryPedido, [
      datosCliente.nombre,
      datosCliente.email,
      datosCliente.telefono || null,
      datosCliente.direccion,
      datosCliente.apartamento || null,
      datosCliente.ciudad,
      datosCliente.estado,
      datosCliente.codigoPostal,
      metodoPago,
      metodoEnvio,
      formatearDecimal(subtotal),
      formatearDecimal(costoEnvio),
      formatearDecimal(impuesto),
      formatearDecimal(total)
    ]);
    
    const pedidoId = resultadoPedido[0].id;
    console.log('Pedido creado con ID:', pedidoId);

    // Paso 2: Insertar los items del carrito
    const queryItem = `
      INSERT INTO pedido_items (pedido_id, nombre_producto, precio, cantidad)
      VALUES ($1, $2, $3, $4)
    `;
    
    for (const item of carrito) {
      await sql(queryItem, [
        pedidoId,
        item.name || item.title || 'Producto sin nombre',
        formatearDecimal(item.price || 0),
        parseInt(item.cantidad || item.quantity || 1)
      ]);
    }

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

// Endpoint opcional para obtener un pedido por ID
app.get('/api/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar el pedido
    const pedidoQuery = 'SELECT * FROM pedidos WHERE id = $1';
    const pedido = await sql(pedidoQuery, [parseInt(id)]);
    
    if (!pedido || pedido.length === 0) {
      return res.status(404).json({ 
        status: false, 
        error: 'Pedido no encontrado' 
      });
    }
    
    // Buscar los items del pedido
    const itemsQuery = 'SELECT * FROM pedido_items WHERE pedido_id = $1';
    const items = await sql(itemsQuery, [parseInt(id)]);
    
    res.json({ 
      status: true, 
      pedido: {
        ...pedido[0],
        items: items
      }
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
    const query = `
      SELECT 
        p.*,
        json_agg(
          json_build_object(
            'id', pi.id,
            'nombre_producto', pi.nombre_producto,
            'precio', pi.precio,
            'cantidad', pi.cantidad
          )
        ) as items
      FROM pedidos p
      LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
    
    const pedidos = await sql(query);

    res.json({ 
      status: true, 
      pedidos: pedidos 
    });

  } catch (error) {
    console.error('Error al listar pedidos:', error);
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
