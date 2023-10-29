import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
// @ts-ignore
import manifest from './src/manifest'
// @ts-ignore
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      outDir: 'build',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/chunk-[hash].js',
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          // additionalData: `@import "${path.resolve(__dirname, 'src/theme.module.less')}";`,
          javascriptEnabled: true,
        },
      },
      modules: {
        // css模块化 文件以.module.[css|less|scss]结尾
        generateScopedName: '[name]__[local]___[hash:base64:5]',
        hashPrefix: 'prefix',
      },
    },

    resolve: {
      // 配置路径别名
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [crx({ manifest }), react()],
  }
})
