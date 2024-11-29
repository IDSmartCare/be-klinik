# Tahap 1: Build Stage
# Menggunakan image Node.js 20.17.0 dengan Alpine sebagai base image untuk membangun aplikasi
FROM dns-regs.dnstech.co.id/library/node:20.17.0-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json untuk caching dependensi
COPY package*.json ./

# Install semua dependensi, termasuk Prisma
RUN npm install \
    && npm cache clean --force

# Copy seluruh kode sumber ke dalam image
COPY . ./

#RUN cp .env.docker .env

# Generate Prisma client dan build aplikasi
RUN npx prisma generate && npm run build

# Tahap 2: Production Stage
# Menggunakan image Node.js 20.17.0 dengan Alpine sebagai base image untuk lingkungan produksi
FROM dns-regs.dnstech.co.id/library/node:20.17.0-alpine AS production

# Instal dependensi tambahan (libssl untuk dependensi terkait OpenSSL, dumb-init untuk inisialisasi proses)
RUN apk update && apk add --no-cache openssl dumb-init

# Tentukan direktori kerja di dalam container
WORKDIR /app


# Salin hasil build (dist) dari tahap build ke container produksi
COPY --chown=node:node --from=builder /app/dist ./dist

# Salin file .env dari tahap build ke container produksi
#COPY --chown=node:node --from=builder /app/.env .env

# Salin file package.json dan package-lock.json dari tahap build untuk memastikan dependensi yang sama di lingkungan produksi
COPY --chown=node:node --from=builder /app/package.json .
COPY --chown=node:node --from=builder /app/package-lock.json .

# Install dependensi untuk produksi (mengabaikan dev dependencies)
RUN npm install --omit=dev

# Salin Prisma client yang sudah dibangun dari tahap build ke container produksi
COPY --chown=node:node --from=builder /app/node_modules/.prisma/client  ./node_modules/.prisma/client

# Set environment variable untuk menentukan mode produksi
ENV NODE_ENV production

# Expose port 3000 yang akan digunakan oleh aplikasi
EXPOSE 80

# Jalankan aplikasi menggunakan dumb-init untuk menangani sinyal proses dengan benar
CMD ["dumb-init", "node", "dist/src/main"]
