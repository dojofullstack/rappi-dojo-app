import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

// Crear conexión con Neon usando HTTP
const connectionString = process.env.NETLIFY_DATABASE_URL;

if (!connectionString) {
  throw new Error('NETLIFY_DATABASE_URL no está configurada');
}

const sql = neon(connectionString);

// Exportar instancia de Drizzle con el schema
export const db = drizzle(sql, { schema });
