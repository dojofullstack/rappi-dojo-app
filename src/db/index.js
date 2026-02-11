import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

// Crear conexión con Neon usando HTTP
const sql = neon(process.env.NETLIFY_DATABASE_URL);

// Exportar instancia de Drizzle con el schema
export const db = drizzle(sql, { schema });
