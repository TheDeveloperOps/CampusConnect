// vite.config.js
import { defineConfig } from "file:///C:/Users/USER/FinalYearProject-WebApplication/Campus-Connect/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/USER/FinalYearProject-WebApplication/Campus-Connect/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 3e3,
    // Get rid of the CORS error
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVU0VSXFxcXEZpbmFsWWVhclByb2plY3QtV2ViQXBwbGljYXRpb25cXFxcQ2FtcHVzLUNvbm5lY3RcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFVTRVJcXFxcRmluYWxZZWFyUHJvamVjdC1XZWJBcHBsaWNhdGlvblxcXFxDYW1wdXMtQ29ubmVjdFxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvVVNFUi9GaW5hbFllYXJQcm9qZWN0LVdlYkFwcGxpY2F0aW9uL0NhbXB1cy1Db25uZWN0L2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cdHBsdWdpbnM6IFtyZWFjdCgpXSxcblx0c2VydmVyOiB7XG5cdFx0cG9ydDogMzAwMCxcblx0XHQvLyBHZXQgcmlkIG9mIHRoZSBDT1JTIGVycm9yXG5cdFx0cHJveHk6IHtcblx0XHRcdFwiL2FwaVwiOiB7XG5cdFx0XHRcdHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjUwMDBcIixcblx0XHRcdFx0Y2hhbmdlT3JpZ2luOiB0cnVlLFxuXHRcdFx0XHRzZWN1cmU6IGZhbHNlLFxuXHRcdFx0fSxcblx0XHR9LFxuXHR9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZZLFNBQVMsb0JBQW9CO0FBQzFhLE9BQU8sV0FBVztBQUdsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ1AsTUFBTTtBQUFBO0FBQUEsSUFFTixPQUFPO0FBQUEsTUFDTixRQUFRO0FBQUEsUUFDUCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDVDtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQ0QsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
