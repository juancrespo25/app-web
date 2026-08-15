# ---------- Etapa 1: build ----------
FROM node:22.18.0-alpine AS builder

WORKDIR /app

# Habilitar pnpm vía corepack (viene con Node)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar solo los manifests primero (mejor cache de capas)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

# VITE_API_URL se "hornea" en el bundle en tiempo de build,
# por eso se pasa como build-arg y no como variable de entorno en runtime.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm run build

# ---------- Etapa 2: runtime ----------
FROM nginx:1.27-alpine AS runtime

# Config de nginx para SPA (React Router / Vite)
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
