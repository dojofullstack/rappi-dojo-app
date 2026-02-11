/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NETLIFY_DATABASE_URL,
  },
};
