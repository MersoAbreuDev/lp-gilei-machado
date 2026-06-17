# LP Gilei Machado — Vite + nginx (porta $PORT do Dokploy).

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci 2>/dev/null || npm install

COPY . .

ARG VITE_API_URL
ARG VITE_SALON_SLUG
ARG VITE_ENROLLMENT_API_KEY
ARG VITE_WHATSAPP
ARG VITE_INSTAGRAM_URL
RUN set -e; \
  if [ -n "${VITE_API_URL}" ]; then export VITE_API_URL; fi; \
  if [ -n "${VITE_SALON_SLUG}" ]; then export VITE_SALON_SLUG; fi; \
  if [ -n "${VITE_ENROLLMENT_API_KEY}" ]; then export VITE_ENROLLMENT_API_KEY; fi; \
  if [ -n "${VITE_WHATSAPP}" ]; then export VITE_WHATSAPP; fi; \
  if [ -n "${VITE_INSTAGRAM_URL}" ]; then export VITE_INSTAGRAM_URL; fi; \
  npm run build

FROM nginx:1.27-alpine AS runner
RUN apk add --no-cache gettext
COPY docker/nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker/runtime-config.template.js /runtime-config.template.js
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
COPY --from=build /app/dist /usr/share/nginx/html

ENV VITE_API_URL=https://hml.multsysapi.oscarpro.com.br
ENV VITE_SALON_SLUG=gilei
ENV VITE_ENROLLMENT_API_KEY=
ENV VITE_WHATSAPP=
ENV VITE_INSTAGRAM_URL=
ENV PORT=80

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
