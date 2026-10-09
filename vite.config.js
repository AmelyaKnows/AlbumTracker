import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Make .env.local values (like OPENAI_API_KEY) available to the function
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [
      react(),
      {
        name: "local-api",
        configureServer(server) {
          server.middlewares.use("/api/recommend", async (req, res) => {
            try {
              let body = "";
              for await (const chunk of req) body += chunk;
              req.body = body ? JSON.parse(body) : {};
              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data) => {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(data));
              };
              const { default: handler } = await server.ssrLoadModule("/api/recommend.js");
              await handler(req, res);
            } catch (err) {
              console.error(err);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Local API error. Check the terminal." }));
            }
          });
        },
      },
    ],
  };
});