import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Cada trabalho é um arquivo .md em src/content/trabalhos/
// O texto abaixo do frontmatter vira a descrição do projeto.
const trabalhos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/trabalhos' }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      subtitulo: z.string().optional(), // linha curta abaixo do título (ex.: "O tecido conversando com o vento")
      cliente: z.string(),
      ano: z.number(),
      local: z.string(),
      categoria: z.string(),
      ordem: z.number(), // posição na home (1 = primeiro)
      capa: image(),
      capaAlt: z.string(),
      fotos: z.array(
        z.object({
          src: image(),
          alt: z.string(),
          // "inteira" ocupa a largura toda; duas "metade" seguidas ficam lado a lado no desktop
          largura: z.enum(['inteira', 'metade']).default('inteira'),
        }),
      ),
      video: z
        .object({
          nome: z.string(), // prefixo dos arquivos em public/video (ver scripts/encode-video.sh)
          posterMobile: image(),
          posterDesktop: image(),
          legenda: z.string(),
          depoisDaFoto: z.number().default(2), // aparece depois da foto N
        })
        .optional(),
    }),
});

export const collections = { trabalhos };
