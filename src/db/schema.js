import { pgTable, serial, text, timestamp, integer, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tabla principal de pedidos
export const pedidos = pgTable('pedidos', {
  id: serial('id').primaryKey(),
  
  // Datos del cliente
  nombre: text('nombre').notNull(),
  email: text('email').notNull(),
  telefono: text('telefono'),
  
  // Dirección de envío
  direccion: text('direccion').notNull(),
  apartamento: text('apartamento'),
  ciudad: text('ciudad').notNull(),
  estado: text('estado').notNull(),
  codigoPostal: text('codigo_postal').notNull(),
  
  // Datos del pedido
  metodoPago: text('metodo_pago').notNull(), // 'tarjeta' o 'paypal'
  metodoEnvio: text('metodo_envio').notNull(), // 'gratis' o 'express'
  
  // Montos
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  costoEnvio: decimal('costo_envio', { precision: 10, scale: 2 }).notNull(),
  impuesto: decimal('impuesto', { precision: 10, scale: 2 }).notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow(),
});

// Tabla de items del pedido (relación 1:N con pedidos)
export const pedidoItems = pgTable('pedido_items', {
  id: serial('id').primaryKey(),
  pedidoId: integer('pedido_id').notNull().references(() => pedidos.id),
  
  // Datos del producto
  nombreProducto: text('nombre_producto').notNull(),
  precio: decimal('precio', { precision: 10, scale: 2 }).notNull(),
  cantidad: integer('cantidad').notNull().default(1),
});

// Relación entre pedidos y sus items
export const pedidosRelations = relations(pedidos, ({ many }) => ({
  items: many(pedidoItems),
}));

export const pedidoItemsRelations = relations(pedidoItems, ({ one }) => ({
  pedido: one(pedidos, {
    fields: [pedidoItems.pedidoId],
    references: [pedidos.id],
  }),
}));
