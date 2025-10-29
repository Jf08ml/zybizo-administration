// backend/api/[...all].js
import app from "../src/app.js";

// Vercel (Node 20) necesita un handler (req, res).
// Express "app" ya es un manejador compatible.
export default function handler(req, res) {
  return app(req, res);
}
