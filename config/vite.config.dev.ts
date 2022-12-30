import { defineConfig, mergeConfig } from 'vite'
import viteBaseConfig from './vite.config.base'

export default mergeConfig(
  defineConfig({
    mode: 'development',
    root: process.cwd(),
    server: {
      open: false,
      fs: {
        strict: true,
      },
    },
  }),
  viteBaseConfig,
)
