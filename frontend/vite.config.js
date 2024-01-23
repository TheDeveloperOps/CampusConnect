import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		// Get rid of the CORS error
		proxy: {
			"/api": {
				target: "https://master--storied-croquembouche-22ca55.netlify.app",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
