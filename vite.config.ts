/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import transformerDirective from '@unocss/transformer-directives'
import { presetWind } from 'unocss'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/custom.scss" as *;',
      },
    },
  },
  plugins: [
    Vue(),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      dirs: [
        { dir: 'src/pages/**', baseRoute: '' },
        // { dir: '@/pages/Lyrics', baseRoute: '' },
      ],
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass',
        directives: true,
        version: '2.1.10',
      })],
      imports: [
        'vue',
        'vue/macros',
        'vue-router',
        '@vueuse/core',
      ],
      dts: true,
    }),
    // https://github.com/antfu/vite-plugin-components
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass',
        directives: true,
        version: '2.1.10',
      })],
      dts: true,
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss({
      presets: [
        presetWind(),
      ],
      rules: [],
      transformers: [
        transformerDirective(),
      ],
    }),

    // ElementPlus({
    //   useSource: false,
    // }),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
  },
})
