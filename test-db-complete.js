import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NETLIFY_DATABASE_URL);

async function testDatabase() {
  console.log('🔍 Iniciando tests de base de datos...\n');
  
  try {
    // Test 1: Conexión básica
    console.log('1️⃣ Test de conexión...');
    const timeResult = await sql`SELECT NOW() as current_time`;
    console.log('✅ Conexión exitosa!');
    console.log('   Hora del servidor:', timeResult[0].current_time);
    console.log('');

    // Test 2: Verificar tablas existentes
    console.log('2️⃣ Verificando tablas existentes...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('   Tablas encontradas:', tables.length === 0 ? 'NINGUNA' : '');
    tables.forEach(t => console.log('   -', t.table_name));
    console.log('');

    // Test 3: Crear tabla pedidos
    console.log('3️⃣ Creando tabla pedidos...');
    await sql`
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL,
        telefono TEXT,
        direccion TEXT NOT NULL,
        apartamento TEXT,
        ciudad TEXT NOT NULL,
        estado TEXT NOT NULL,
        codigo_postal TEXT NOT NULL,
        metodo_pago TEXT NOT NULL,
        metodo_envio TEXT NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL,
        costo_envio NUMERIC(10, 2) NOT NULL,
        impuesto NUMERIC(10, 2) NOT NULL,
        total NUMERIC(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Tabla pedidos creada (o ya existía)');
    console.log('');

    // Test 4: Crear tabla pedido_items
    console.log('4️⃣ Creando tabla pedido_items...');
    await sql`
      CREATE TABLE IF NOT EXISTS pedido_items (
        id SERIAL PRIMARY KEY,
        pedido_id INTEGER NOT NULL REFERENCES pedidos(id),
        nombre_producto TEXT NOT NULL,
        precio NUMERIC(10, 2) NOT NULL,
        cantidad INTEGER DEFAULT 1 NOT NULL
      )
    `;
    console.log('✅ Tabla pedido_items creada (o ya existía)');
    console.log('');

    // Test 5: Verificar tablas de nuevo
    console.log('5️⃣ Verificando tablas después de la creación...');
    const tablesAfter = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('   Tablas actuales:');
    tablesAfter.forEach(t => console.log('   ✓', t.table_name));
    console.log('');

    // Test 6: Ver estructura de la tabla pedidos
    console.log('6️⃣ Estructura de la tabla pedidos:');
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'pedidos'
      ORDER BY ordinal_position
    `;
    columns.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });
    console.log('');

    // Test 7: Insertar un pedido de prueba
    console.log('7️⃣ Insertando pedido de prueba...');
    const testPedido = await sql`
      INSERT INTO pedidos (
        nombre, email, telefono, direccion, apartamento,
        ciudad, estado, codigo_postal, metodo_pago, metodo_envio,
        subtotal, costo_envio, impuesto, total
      ) VALUES (
        ${'Test Usuario'},
        ${'test@example.com'},
        ${'+51999999999'},
        ${'Calle Test 123'},
        ${'Apt 1'},
        ${'Lima'},
        ${'Lima'},
        ${'15001'},
        ${'tarjeta'},
        ${'gratis'},
        ${'100.00'},
        ${'0.00'},
        ${'0.00'},
        ${'100.00'}
      )
      RETURNING id
    `;
    const pedidoId = testPedido[0].id;
    console.log('✅ Pedido de prueba creado con ID:', pedidoId);
    console.log('');

    // Test 8: Insertar items del pedido de prueba
    console.log('8️⃣ Insertando items del pedido de prueba...');
    await sql`
      INSERT INTO pedido_items (pedido_id, nombre_producto, precio, cantidad)
      VALUES (
        ${pedidoId},
        ${'Producto de prueba'},
        ${'50.00'},
        ${2}
      )
    `;
    console.log('✅ Items insertados');
    console.log('');

    // Test 9: Consultar el pedido creado
    console.log('9️⃣ Consultando el pedido de prueba...');
    const pedido = await sql`
      SELECT * FROM pedidos WHERE id = ${pedidoId}
    `;
    console.log('   Pedido encontrado:');
    console.log('   - ID:', pedido[0].id);
    console.log('   - Nombre:', pedido[0].nombre);
    console.log('   - Email:', pedido[0].email);
    console.log('   - Total:', pedido[0].total);
    console.log('');

    // Test 10: Consultar items del pedido
    console.log('🔟 Consultando items del pedido...');
    const items = await sql`
      SELECT * FROM pedido_items WHERE pedido_id = ${pedidoId}
    `;
    console.log('   Items encontrados:', items.length);
    items.forEach(item => {
      console.log(`   - ${item.nombre_producto}: $${item.precio} x${item.cantidad}`);
    });
    console.log('');

    // Test 11: Contar pedidos totales
    console.log('1️⃣1️⃣ Contando pedidos totales...');
    const count = await sql`SELECT COUNT(*) as total FROM pedidos`;
    console.log('   Total de pedidos en la base de datos:', count[0].total);
    console.log('');

    console.log('🎉 ¡Todos los tests pasaron exitosamente!');
    console.log('');
    console.log('📊 Resumen:');
    console.log('   ✅ Conexión a Neon: OK');
    console.log('   ✅ Tablas creadas: OK');
    console.log('   ✅ Inserción de datos: OK');
    console.log('   ✅ Consultas: OK');
    console.log('');
    console.log('🚀 Tu base de datos está lista para recibir pedidos!');

  } catch (error) {
    console.error('');
    console.error('❌ ERROR:', error.message);
    console.error('');
    console.error('Stack completo:');
    console.error(error.stack);
    process.exit(1);
  }
}

// Ejecutar tests
testDatabase();
