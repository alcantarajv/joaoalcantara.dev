// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Endereço canônico do site: base para URLs absolutas (canonical, Open Graph, sitemap).
  site: 'https://joaoalcantara.dev',

  markdown: {
    shikiConfig: {
      // Os blocos de código usam variáveis CSS em vez de cores fixas;
      // os valores vêm de tokens.css e acompanham o tema claro/escuro.
      theme: 'css-variables',
    },
  },
});
