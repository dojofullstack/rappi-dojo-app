# 🚀 Backend Checkout - Guía de Despliegue

## ✅ Implementación Completada

Se ha configurado exitosamente el backend serverless con las siguientes características:

### 📦 Estructura Creada

```
rappi-dojo-app/
├── .env                          # Variables de entorno (DATABASE_URL)
├── drizzle.config.js             # Configuración de Drizzle ORM
├── netlify.toml                  # Configuración de Netlify
├── drizzle/                      # Migraciones SQL generadas
│   └── 0000_familiar_layla_miller.sql
├── netlify/
│   └── functions/
│       └── api.js                # Función serverless (Express + Endpoints)
└── src/
    ├── db/
    │   ├── schema.js             # Tablas: pedidos y pedido_items
    │   └── index.js              # Conexión a Neon DB
    └── views/
        └── Checkout.jsx          # Integración con el backend
```

### 🗄️ Base de Datos

**Tablas creadas en Neon DB:**

1. **`pedidos`** - Información principal del pedido
   - Datos del cliente (nombre, email, teléfono)
   - Dirección de envío (dirección, ciudad, estado, código postal)
   - Métodos (pago y envío)
   - Totales (subtotal, costo envío, impuesto, total)
   - Timestamp de creación

2. **`pedido_items`** - Items del carrito (relación 1:N)
   - Referencia al pedido (pedidoId)
   - Datos del producto (nombre, precio, cantidad)

### 🔌 Endpoints API

**POST** `/api/pedidos`
- Crea un nuevo pedido con sus items
- Retorna: `{ status: true, pedidoId: X }`

**GET** `/api/pedidos/:id`
- Obtiene un pedido específico con sus items

**GET** `/api/pedidos`
- Lista todos los pedidos

---

## 🧪 Pruebas Locales

### 1. Instalar Netlify CLI (si no lo tienes)

```bash
npm install -g netlify-cli
```

### 2. Ejecutar el servidor de desarrollo

```bash
netlify dev
```

Esto iniciará:
- Frontend en `http://localhost:8888`
- Functions en `http://localhost:8888/.netlify/functions/api`

### 3. Probar el Checkout

1. Abre `http://localhost:8888`
2. Agrega productos al carrito
3. Ve a la página de Checkout
4. Completa el formulario con datos de prueba:
   - **Nombre:** Juan Pérez
   - **Email:** juan@example.com
   - **Dirección:** Calle 123
   - **Ciudad:** Bogotá
   - **Estado:** Cundinamarca
   - **Código Postal:** 110111
   - **Método de pago:** Tarjeta o PayPal
   - **Método de envío:** Gratis o Express

5. Haz clic en "COMPLETAR PAGO"
6. Verifica que aparezca el alert de éxito con el número de pedido

### 4. Verificar en la Base de Datos

Entra al dashboard de Neon y ejecuta:

```sql
-- Ver todos los pedidos
SELECT * FROM pedidos ORDER BY created_at DESC;

-- Ver items de un pedido específico
SELECT * FROM pedido_items WHERE pedido_id = 1;

-- Ver pedido completo con sus items (JOIN)
SELECT 
  p.*,
  pi.nombre_producto,
  pi.precio,
  pi.cantidad
FROM pedidos p
LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
ORDER BY p.created_at DESC;
```

---

## 🌐 Despliegue a Netlify

### Opción 1: Deploy desde Git (Recomendado)

1. **Sube tu código a GitHub/GitLab**

```bash
git add .
git commit -m "feat: Add backend checkout with Neon DB"
git push origin main
```

2. **Conecta el repositorio en Netlify**
   - Ve a https://app.netlify.com/
   - Click en "Add new site" → "Import an existing project"
   - Conecta tu repositorio
   - Netlify detectará automáticamente la configuración de `netlify.toml`

3. **Agrega la variable de entorno**
   - En el dashboard de Netlify: `Site settings` → `Environment variables`
   - Agrega: `DATABASE_URL` con el valor completo de tu conexión a Neon
   - **IMPORTANTE:** No incluyas esta variable en el código, solo en Netlify

4. **Deploy automático**
   - Netlify construirá y desplegará automáticamente
   - Los siguientes push también se desplegarán automáticamente

### Opción 2: Deploy Manual con Netlify CLI

```bash
# Login en Netlify CLI
netlify login

# Inicializar el sitio
netlify init

# Agregar variable de entorno
netlify env:set DATABASE_URL "postgresql://neondb_owner:..."

# Deploy manual
netlify deploy --prod
```

---

## 🔐 Seguridad

✅ **Implementado:**
- Los datos sensibles de tarjeta NO se guardan en la base de datos
- Solo se guarda el método de pago (tarjeta/paypal)
- El archivo `.env` está en `.gitignore`
- La `DATABASE_URL` solo se configura en Netlify como variable de entorno

⚠️ **Recomendaciones adicionales para producción:**
- Implementar validación de emails
- Agregar autenticación de usuarios
- Implementar rate limiting en las APIs
- Validar montos del lado del servidor
- Agregar logs de auditoría

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
- Verifica que la variable `DATABASE_URL` esté configurada en Netlify
- Verifica que la IP de Netlify esté permitida en Neon (por defecto está permitido)

### Error: "Module not found"
- Verifica que todas las dependencias estén en `package.json`
- Ejecuta `npm install` antes de desplegar

### Error: "Function timeout"
- Las funciones de Netlify tienen un timeout de 10s en el plan gratuito
- Optimiza las queries si es necesario
- Considera actualizar a un plan superior si necesario

### Error: "CORS"
- Netlify Functions maneja CORS automáticamente para el mismo dominio
- Si necesitas acceso desde otros dominios, agrega headers CORS en `api.js`

---

## 📊 Monitoreo

### Ver logs en producción

```bash
netlify logs:function api
```

O desde el dashboard de Netlify: `Functions` → `api` → `Function logs`

### Verificar despliegues

```bash
netlify status
```

---

## 🚀 Siguientes Pasos

1. ✅ **Testing básico completado** - Prueba localmente con `netlify dev`
2. ⏳ **Deploy a Netlify** - Sigue las instrucciones de arriba
3. 📧 **Notificaciones por email** - Implementa envío de emails al crear pedido
4. 👤 **Autenticación** - Conecta con usuarios registrados
5. 💳 **Pasarela de pago** - Integra Stripe o PayPal para pagos reales
6. 📱 **Panel de administración** - Crea vistas para ver pedidos

---

## 📚 Recursos

- [Documentación de Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Neon Database](https://neon.tech/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

**¡Todo listo para producción!** 🎉
