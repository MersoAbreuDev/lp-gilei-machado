#!/bin/sh
set -e
export PORT="${PORT:-80}"
export VITE_API_URL="${VITE_API_URL:-https://hml.multsysapi.oscarpro.com.br}"
export VITE_SALON_SLUG="${VITE_SALON_SLUG:-gilei}"
export VITE_ENROLLMENT_API_KEY="${VITE_ENROLLMENT_API_KEY:-wcfit-local-enrollment-2026}"
export VITE_WHATSAPP="${VITE_WHATSAPP:-}"
export VITE_INSTAGRAM_URL="${VITE_INSTAGRAM_URL:-}"
envsubst '$VITE_API_URL $VITE_SALON_SLUG $VITE_ENROLLMENT_API_KEY $VITE_WHATSAPP $VITE_INSTAGRAM_URL' \
  < /runtime-config.template.js > /usr/share/nginx/html/runtime-config.js
envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"
