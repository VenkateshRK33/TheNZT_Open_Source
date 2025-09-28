# ---------- Stage 1: Build the Next.js application ----------
FROM node:20-alpine AS builder

# Prefer IPv4
RUN echo 'precedence ::ffff:0:0/96  100' >> /etc/gai.conf

WORKDIR /app

# Install dependencies
COPY src/frontend/package.json ./
COPY src/frontend/package-lock.json ./
RUN npm install --legacy-peer-deps

# Build
COPY src/frontend .
RUN npm run build

# ---------- Stage 2: Serve the Python app ----------
FROM python:3.12-slim-bookworm AS runner

# Prefer IPv4
RUN echo 'precedence ::ffff:0:0/96  100' >> /etc/gai.conf

# OS deps (incl. bash/curl for compose healthcheck)
RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  wkhtmltopdf \
  wget \
  curl \
  unzip \
  bash \
  locales \
  fonts-noto \
  fonts-noto-cjk \
  fonts-noto-color-emoji \
  fonts-noto-extra \
  fonts-noto-ui-extra \
  fonts-deva \
  fonts-gujr && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# WeasyPrint deps
RUN apt-get update && apt-get install -y \
  build-essential \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libcairo2 \
  libgdk-pixbuf2.0-0 \
  libffi-dev \
  libjpeg62-turbo \
  libpng16-16 \
  libfreetype6 \
  shared-mime-info \
  fonts-liberation \
  && rm -rf /var/lib/apt/lists/*

# Locales
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && \
  echo "hi_IN.UTF-8 UTF-8" >> /etc/locale.gen && \
  echo "ar_SA.UTF-8 UTF-8" >> /etc/locale.gen && \
  echo "gu_IN.UTF-8 UTF-8" >> /etc/locale.gen && \
  echo "zh_CN.UTF-8 UTF-8" >> /etc/locale.gen && \
  echo "zh_TW.UTF-8 UTF-8" >> /etc/locale.gen && \
  echo "ja_JP.UTF-8 UTF-8" >> /etc/locale.gen && \
  echo "ko_KR.UTF-8 UTF-8" >> /etc/locale.gen && \
  echo "ru_RU.UTF-8 UTF-8" >> /etc/locale.gen && \
  echo "fr_FR.UTF-8 UTF-8" >> /etc/locale.gen && \
  echo "de_DE.UTF-8 UTF-8" >> /etc/locale.gen && \
  echo "es_ES.UTF-8 UTF-8" >> /etc/locale.gen && \
  echo "pt_PT.UTF-8 UTF-8" >> /etc/locale.gen && \
  echo "it_IT.UTF-8 UTF-8" >> /etc/locale.gen && \
  locale-gen

# Python deps
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --root-user-action=ignore -r /app/requirements.txt

# App code
WORKDIR /app

# Keep src as a real package at /app/src
COPY ./src /app/src

# Make /app discoverable (so `import src...` works)
ENV PYTHONPATH=/app

# Copy frontend build output from builder stage
# (If you use `next export`, this will be /app/out; otherwise you may want .next)
COPY --from=builder /app/out /app/out

EXPOSE 8000

# Run the API
CMD ["uvicorn", "src.backend.app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
