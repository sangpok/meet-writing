import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';

const TEST_HTTPS = false;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: TEST_HTTPS ? [react(), mkcert()] : [react()],
  resolve: {
    alias: [
      { find: '@APIs', replacement: '/src/APIs' },
      { find: '@Assets', replacement: '/src/Assets' },
      { find: '@Components', replacement: '/src/Components' },
      { find: '@Firebase', replacement: '/src/Firebase' },
      { find: '@Hooks', replacement: '/src/Hooks' },
      { find: '@Icons', replacement: '/src/Icons' },
      { find: '@Layouts', replacement: '/src/Layouts' },
      { find: '@Pages', replacement: '/src/Pages' },
      { find: '@Routes', replacement: '/src/Routes' },
      { find: '@Store', replacement: '/src/Store' },
      { find: '@Styles', replacement: '/src/Styles' },
      { find: '@Type', replacement: '/src/Type' },
      { find: '@Utils', replacement: '/src/Utils' },
      { find: '@', replacement: '/src' },
    ],
  },
  server: { port: 5760 },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
