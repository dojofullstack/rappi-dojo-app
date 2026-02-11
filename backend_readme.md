# 🚀 Configuración Node.js (Express) + Drizzle ORM + Neon DB en Netlify

Este documento detalla la configuración de una arquitectura moderna "Serverless" utilizando **Neon** como base de datos PostgreSQL, **Drizzle ORM** para las consultas y **Netlify Functions** para el backend.

---

## 🛠️ Requisitos Previos

* Proyecto de **React + Vite**.
* Cuenta en **Neon.tech**.
* Cuenta en **Netlify**.

---

## 📦 1. Instalación de Dependencias

Ejecuta el siguiente comando en la raíz de tu proyecto:

```bash
# Core de base de datos y driver serverless
npm install drizzle-orm @neondatabase/serverless serverless-http express

# Herramientas de desarrollo
npm install -D drizzle-kit dotenv

NETLIFY_DATABASE_URL='postgresql://neondb_owner:npg_FZvdPU3j6rTi@ep-noisy-paper-ai3t4009-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'


import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  age: integer('age'),
  createdAt: timestamp('created_at').defaultNow(),
});



import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });



import express from 'express';
import serverless from 'serverless-http';
import { db } from '../../src/db';
import { users } from '../../src/db/schema';
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());

// Obtener todos los usuarios con filtros
app.get('/api/users', async (req, res) => {
  try {
    const result = await db.select().from(users);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un usuario
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await db.insert(users).values({ name, email }).returning();
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export const handler = serverless(app);


[build]
  command = "npm run build"
  publish = "dist"

[functions]
  node_bundle = true
  external_node_modules = ["@neondatabase/serverless"]

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200




  /** @type { import("drizzle-kit").Config } */
export default {
  schema: "./src/db/schema.js",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
};