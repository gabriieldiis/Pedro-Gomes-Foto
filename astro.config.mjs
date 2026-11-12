import { defineConfig } from 'astro/config';
import { site } from './src/site.config.ts';

export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' }, // CSS pequeno vai inline: zero requisição bloqueando a renderização
  image: {
    responsiveStyles: false,
  },
});
