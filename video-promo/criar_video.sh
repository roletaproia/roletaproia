#!/bin/bash

# Script para criar vídeo promocional do Roleta Pro I.A.
# Usando apenas screenshots do sistema

echo "🎬 Iniciando criação do vídeo promocional..."

# Diretórios
SCREENSHOTS_DIR="screenshots"
OUTPUT_DIR="output"
mkdir -p "$OUTPUT_DIR"

# Configurações
FPS=30
DURATION_PER_IMAGE=7  # segundos por imagem
TRANSITION_DURATION=0.5  # duração da transição em segundos

echo "📸 Preparando screenshots..."

# Criar arquivo de lista para FFmpeg
cat > /tmp/video_list.txt << EOF
file '$PWD/$SCREENSHOTS_DIR/01-dashboard.webp'
duration $DURATION_PER_IMAGE
file '$PWD/$SCREENSHOTS_DIR/02-sinais-inteligentes.webp'
duration $DURATION_PER_IMAGE
file '$PWD/$SCREENSHOTS_DIR/03-historico-estatisticas.webp'
duration $DURATION_PER_IMAGE
file '$PWD/$SCREENSHOTS_DIR/04-chat-comunidade.webp'
duration $DURATION_PER_IMAGE
file '$PWD/$SCREENSHOTS_DIR/05-gerenciamento-banca.webp'
duration $DURATION_PER_IMAGE
file '$PWD/$SCREENSHOTS_DIR/06-estrategias.webp'
duration $DURATION_PER_IMAGE
file '$PWD/$SCREENSHOTS_DIR/07-indicacoes.webp'
duration $DURATION_PER_IMAGE
EOF

echo "🎥 Gerando vídeo base..."

# Gerar vídeo base com screenshots
ffmpeg -f concat -safe 0 -i /tmp/video_list.txt \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,fps=$FPS" \
  -c:v libx264 -pix_fmt yuv420p -preset medium -crf 23 \
  "$OUTPUT_DIR/video_base.mp4" -y

echo "✨ Adicionando texto de abertura..."

# Criar vídeo de abertura (3 segundos)
ffmpeg -f lavfi -i color=c=black:s=1920x1080:d=3 \
  -vf "drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='ROLETA PRO I.A.':fontcolor=white:fontsize=80:x=(w-text_w)/2:y=(h-text_h)/2-50,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='O Robô Inteligente 100%% GRÁTIS':fontcolor=gold:fontsize=40:x=(w-text_w)/2:y=(h-text_h)/2+50" \
  -c:v libx264 -pix_fmt yuv420p -t 3 "$OUTPUT_DIR/abertura.mp4" -y

echo "🎯 Adicionando texto de encerramento..."

# Criar vídeo de encerramento (3 segundos)
ffmpeg -f lavfi -i color=c=black:s=1920x1080:d=3 \
  -vf "drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='CADASTRE-SE AGORA!':fontcolor=gold:fontsize=70:x=(w-text_w)/2:y=(h-text_h)/2-80,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='roletaproia.onrender.com':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=(h-text_h)/2+20,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='100%% GRÁTIS - 7 DIAS DE TESTE':fontcolor=cyan:fontsize=35:x=(w-text_w)/2:y=(h-text_h)/2+100" \
  -c:v libx264 -pix_fmt yuv420p -t 3 "$OUTPUT_DIR/encerramento.mp4" -y

echo "🔗 Juntando tudo..."

# Criar arquivo de lista final
cat > /tmp/final_list.txt << EOF
file '$PWD/$OUTPUT_DIR/abertura.mp4'
file '$PWD/$OUTPUT_DIR/video_base.mp4'
file '$PWD/$OUTPUT_DIR/encerramento.mp4'
EOF

# Juntar tudo
ffmpeg -f concat -safe 0 -i /tmp/final_list.txt \
  -c copy "$OUTPUT_DIR/video_final.mp4" -y

echo "🎨 Criando versão vertical (Stories/Reels)..."

# Versão vertical 9:16
ffmpeg -i "$OUTPUT_DIR/video_final.mp4" \
  -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black" \
  -c:v libx264 -pix_fmt yuv420p -preset medium -crf 23 \
  "$OUTPUT_DIR/video_vertical.mp4" -y

echo "📱 Criando versão quadrada (Instagram Feed)..."

# Versão quadrada 1:1
ffmpeg -i "$OUTPUT_DIR/video_final.mp4" \
  -vf "scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:black" \
  -c:v libx264 -pix_fmt yuv420p -preset medium -crf 23 \
  "$OUTPUT_DIR/video_quadrado.mp4" -y

echo "🧹 Limpando arquivos temporários..."
rm -f "$OUTPUT_DIR/abertura.mp4" "$OUTPUT_DIR/encerramento.mp4" "$OUTPUT_DIR/video_base.mp4"
rm -f /tmp/video_list.txt /tmp/final_list.txt

echo ""
echo "✅ VÍDEOS CRIADOS COM SUCESSO!"
echo ""
echo "📁 Arquivos gerados:"
echo "   - video_final.mp4 (Horizontal 16:9 - YouTube/Facebook)"
echo "   - video_vertical.mp4 (Vertical 9:16 - Stories/Reels/TikTok)"
echo "   - video_quadrado.mp4 (Quadrado 1:1 - Instagram Feed)"
echo ""
echo "📊 Informações:"
ls -lh "$OUTPUT_DIR"/*.mp4
echo ""
echo "🎉 Pronto para publicar!"
