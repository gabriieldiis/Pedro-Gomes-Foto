#!/usr/bin/env bash
# Prepara um vídeo para a web em 4 arquivos leves + 1 poster.
#
#   ./scripts/encode-video.sh entrada.mov nome-de-saida [segundos]
#
# Gera em public/video/:
#   nome-mobile.av1.mp4   540x960   (vertical, AV1  – Chrome, Firefox, Safari 17+ em aparelhos com AV1)
#   nome-mobile.mp4       540x960   (vertical, H.264 – fallback universal)
#   nome-desktop.av1.mp4  1280x720  (horizontal, AV1)
#   nome-desktop.mp4      1280x720  (horizontal, H.264)
# E em src/assets/:
#   nome-poster-mobile.jpg / nome-poster-desktop.jpg  (o Astro converte para AVIF/WebP)
#
# Regras: sem áudio (loop de fundo não precisa), no máximo ~10 s, faststart
# (o navegador começa a tocar antes de baixar tudo). Meta: < 1 MB no mobile, < 2,5 MB no desktop.
set -euo pipefail

IN="$1"; OUT="$2"; DUR="${3:-8}"
V=public/video; A=src/assets
mkdir -p "$V" "$A"

# recorte centralizado para cada orientação
CROP_M="scale=-2:960,crop=540:960"
CROP_D="scale=1280:-2,crop=1280:720"

enc() { # filtro, saída-base
  ffmpeg -y -hide_banner -loglevel error -t "$DUR" -i "$IN" -an -vf "$1,fps=25" \
    -c:v libsvtav1 -preset 6 -crf 40 -g 50 -pix_fmt yuv420p -movflags +faststart "$2.av1.mp4"
  ffmpeg -y -hide_banner -loglevel error -t "$DUR" -i "$IN" -an -vf "$1,fps=25" \
    -c:v libx264 -preset slow -crf 28 -profile:v high -g 50 -pix_fmt yuv420p -movflags +faststart "$2.mp4"
}

enc "$CROP_M" "$V/$OUT-mobile"
enc "$CROP_D" "$V/$OUT-desktop"

# poster = primeiro quadro, para não haver "pulo" quando o vídeo começar
ffmpeg -y -hide_banner -loglevel error -i "$IN" -vf "$CROP_M" -frames:v 1 -q:v 3 "$A/$OUT-poster-mobile.jpg"
ffmpeg -y -hide_banner -loglevel error -i "$IN" -vf "$CROP_D" -frames:v 1 -q:v 3 "$A/$OUT-poster-desktop.jpg"

ls -lh "$V/$OUT"-* "$A/$OUT"-poster-*
