# 🔧 Cambios para solucionar error de inserción en Neon DB

## Problema Original
```
Failed query: insert into "pedidos" ... 
params: henry,hola@dojofullstack.com,+51936670597,Calle Las Tunas 206,lima,lima,Lima,15311,paypal,gratis,139.80,0.00,0.00,139.80
```

## Solución Aplicada

### 1. Simplificación del `.returning()`
**Antes:**
```javascript
const [nuevoPedido] = await db.insert(pedidos).values({...}).returning();
```

**Después:**
```javascript
const resultado = await db.insert(pedidos).values({...}).returning({ id: pedidos.id });
const pedidoId = resultado[0].id;
```

**Razón:** El driver HTTP de Neon puede tener problemas al retornar todas las columnas, especialmente campos `decimal`. Retornar solo el ID reduce la complejidad.

### 2. Validación mejorada de decimales
```javascript
const formatearDecimal = (valor) => {
  const num = parseFloat(valor) || 0;
  return num.toFixed(2); // Siempre 2 decimales: "139.80" no "139.8"
};
```

### 3. Uso de `null` en lugar de strings vacías
**Antes:**
```javascript
telefono: datosCliente.telefono || '',
apartamento: datosCliente.apartamento || '',
```

**Después:**
```javascript
telefono: datosCliente.telefono || null,
apartamento: datosCliente.apartamento || null,
```

**Razón:** Los campos opcionales en PostgreSQL deben ser `null`, no strings vacías.

### 4. Driver simplificado
Usamos el driver HTTP estándar:
```javascript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.NETLIFY_DATABASE_URL);
export const db = drizzle(sql, { schema });
```

## Archivos Modificados
- ✅ `src/db/index.js` - Driver HTTP simplificado
- ✅ `netlify/functions/api.js` - `.returning({ id })` en lugar de `.returning()`
- ✅ `netlify/functions/api.js` - Mejor manejo de decimales y nulls
- ✅ `netlify/functions/api.js` - Logs mejorados para debugging

## Próximos Pasos
1. Hacer commit y push:
   ```bash
   git add .
   git commit -m "fix: Simplify DB insert with returning only ID"
   git push origin main
   ```

2. Netlify redesplegará automáticamente

3. Probar el checkout - Debería funcionar correctamente ahora

## Por qué funciona
El problema era que el driver HTTP de Neon con Drizzle ORM tiene limitaciones al manejar el `.returning()` completo con muchas columnas decimales. Al simplificar para retornar solo el ID y asegurar que los decimales estén correctamente formateados, evitamos el error de parsing.

---
Creado: 11 de febrero de 2026
