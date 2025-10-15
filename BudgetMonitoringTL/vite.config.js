import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  console.log(env.VITE_ENV);
  console.log(env.VITE_PRODUCTION_API);
  console.log(env.VITE_DEVELOPMENT_API);
  console.log(env.VITE_SERVER_PORT);
  console.log(env.VITE_ALLOWED_ORIGIN);
  console.log(env.VITE_BMS_API);
  console.log(env.VITE_GBOOKS_API);

  return {
    plugins: [react()],
    server: {
      port: env.VITE_SERVER_PORT,
      allowedHosts: env.VITE_ALLOWED_HOSTS
        ? env.VITE_ALLOWED_HOSTS.split(",")
        : [],
      proxy: {
        "/api5012": {
          target: env.VITE_BMS_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api5012/, ""),
        },
        "/api5001": {
          target: env.VITE_GBOOKS_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api5001/, ""),
        },
      },
    },
    preview: {
      port: env.VITE_SERVER_PORT,
      allowedHosts: env.VITE_ALLOWED_HOSTS
        ? env.VITE_ALLOWED_HOSTS.split(",")
        : [],
      proxy: {
        "/api5012": {
          target: env.VITE_BMS_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api5012/, ""),
        },
        "/api5001": {
          target: env.VITE_GBOOKS_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api5001/, ""),
        },
      },
    },
    build: {
      outDir: "dist", // output directory
      rollupOptions: {
        // Customize Rollup bundler options
      },
      target: "modules", // browser compatibility target, e.g. 'es2015'
      minify: "terser", // minifier to use, can be false to disable
      sourcemap: false, // whether to generate source maps
      emptyOutDir: true, // clean output directory before build
    },
  };
});
