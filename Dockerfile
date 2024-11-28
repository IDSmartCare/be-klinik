# Tahap 1: Build Stage
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

# Generate Prisma client dan build aplikasi
RUN npx prisma generate \
    && npm run build

# Tahap 2: Production Stage
FROM dns-regs.dnstech.co.id/library/node:20.17.0-alpine AS production

# Set working directory
WORKDIR /app

# Copy package.json untuk runtime dependencies
COPY package*.json ./

# Install hanya production dependencies
RUN npm install --production \
    && npm cache clean --force

# Copy hasil build dari tahap builder
COPY --from=builder /app/dist ./dist

# Buat user non-root untuk menjalankan aplikasi
RUN adduser -D appuser
USER appuser

# Expose port yang digunakan oleh serve
EXPOSE 80

# Jalankan aplikasi menggunakan serve
CMD ["npx", "serve", "-s", "dist"]
