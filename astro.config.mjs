// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Endereço canônico do site: base para URLs absolutas (canonical, Open Graph, sitemap).
  site: 'https://joaoalcantara.dev',

  // URLs sem barra final: /projetos/reserva-quadras, não /projetos/reserva-quadras/.
  // Com format 'file' o build gera projetos/reserva-quadras.html (e não .../index.html),
  // que o Cloudflare serve exatamente nesse endereço sem barra.
  trailingSlash: 'never',
  build: {
    format: 'file',
    // O CSS do site é pequeno: vai dentro de cada HTML em vez de num arquivo à parte.
    // Elimina uma requisição que bloqueava a primeira pintura (apontado pelo Lighthouse).
    inlineStylesheets: 'always',
  },

  integrations: [sitemap()],

  markdown: {
    shikiConfig: {
      // Os blocos de código usam variáveis CSS em vez de cores fixas;
      // os valores vêm de tokens.css e acompanham o tema claro/escuro.
      theme: 'css-variables',
    },
  },
});
