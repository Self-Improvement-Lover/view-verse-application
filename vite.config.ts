import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'spec/support/jasmine.mjs'),
    },
    outDir: 'dist',
  },
});
/*
build: {
rollupOptions:{
   input:resolve(__dirname, 'spec/support/jasmine.mjs'), 
},
outdir:'dist',
}
*/