import { fileURLToPath, URL } from 'node:url'
import DefineOptions from 'unplugin-vue-define-options/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { resolve } from 'path'

const rootDir = fileURLToPath(new URL('..', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    DefineOptions(),
    AutoImport({
      resolvers: [ElementPlusResolver(), IconsResolver({ prefix: 'Icon' })],
      dts: resolve('@types', 'auto-imports.d.ts'),
    }),
    Components({
      resolvers: [ElementPlusResolver(), IconsResolver({ enabledCollections: ['ep'] })],
      dts: resolve('@types', 'components.d.ts'),
    }),
    Icons({
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(rootDir, 'src'),
      stores: resolve(rootDir, 'src/stores'),
    },
  },
  define: {
    'process.env': {},
  },
})
