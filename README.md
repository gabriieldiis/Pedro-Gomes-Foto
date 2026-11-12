# Portfólio de fotógrafo — Astro, mobile first, leve de verdade

Home com vídeo de abertura + 5 páginas de trabalho + sobre + contato.
Fotos e vídeos são **placeholders**: troque pelos reais seguindo os passos abaixo.

## Rodar

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # gera o site estático em dist/
npm run preview    # testa o build
```

O primeiro `build` demora alguns minutos (gera AVIF/WebP de todas as fotos). Depois fica em cache.

## Onde mexer

| O quê | Onde |
|---|---|
| Nome, e-mail, Instagram, bio, clientes, ID do Vimeo | `src/site.config.ts` |
| Trabalhos (texto, ficha, ordem, fotos) | `src/content/trabalhos/*.md` |
| Fotos | `src/assets/trabalhos/<slug>/` |
| Cores, fonte, tamanhos | topo de `src/styles/global.css` |

**Novo trabalho:** copie um `.md`, troque o nome do arquivo (vira a URL), coloque as fotos numa pasta nova e
ajuste os caminhos. `largura: metade` deixa duas fotos lado a lado no desktop (use sempre em pares).

**Fotos:** pode jogar o JPG grande que sai do Lightroom (2400–3000 px no lado maior). O Astro gera
sozinho as versões AVIF/WebP em 5 tamanhos. Escreva o `alt` descrevendo a foto, não o projeto.

## Vídeos (o motivo de este site existir)

Nunca suba o .mov/.mp4 original. Rode:

```bash
./scripts/encode-video.sh bruto.mov reel 8        # reel da home
./scripts/encode-video.sh bastidor.mov nome-do-video 6   # vídeo dentro de um trabalho
```

Isso gera 4 arquivos leves (vertical/horizontal × AV1/H.264, sem áudio, até ~10 s) em `public/video/`
e os posters em `src/assets/`. Precisa do `ffmpeg` instalado.

O componente `VideoLeve` cuida do resto:
- mostra primeiro o **poster** (é ele que o Google mede como LCP);
- só baixa o vídeo **depois do carregamento**, quando ele está **na tela**;
- não toca sozinho com **economia de dados**, **conexão 2G/3G** ou **movimento reduzido** — aparece o botão "Reproduzir vídeo";
- escolhe **vertical no celular** e **horizontal no desktop**, **AV1** quando o aparelho suporta;
- **pausa** fora da tela e em aba de fundo; sempre tem botão de pausar.

O filme completo abre num `<dialog>`; o player do Vimeo só carrega quando alguém clica.

## Publicar

Netlify, Vercel ou Cloudflare Pages: build command `npm run build`, pasta `dist`.
O `public/_headers` já configura cache longo (Netlify/Cloudflare).

## Resultado medido (Lighthouse mobile, 4G lenta simulada, com os placeholders)

| Página | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | Peso inicial |
|---|---|---|---|---|---|---|---|
| Home | 98 | 100 | 100 | 100 | 2,4 s | 0 | 507 KB |
| Trabalho | 99 | 100 | 100 | 100 | 2,1 s | 0 | 805 KB |

Zero dependência de JS no navegador além de ~2 KB próprios (vídeo e modal). Sem GSAP, sem jQuery, sem rolagem falsa.
A transição entre páginas usa View Transitions nativa (Chrome, Edge e Safari 18+); nos outros navegadores a página só troca normalmente.
