# Tahap 1: Build Stage
FROM dns-regs.dnstech.co.id/library/node:20.17.0-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json untuk instalasi dependensi
COPY package.json ./

# Install hanya dependensi
RUN npm install && npm install prisma --save-dev

# Copy seluruh kode sumber ke dalam image
COPY . ./

# Build aplikasi
RUN npm run build

# Tahap 2: Production Stage
FROM dns-regs.dnstech.co.id/library/node:20.17.0-alpine AS production

# Install serve untuk menjalankan aplikasi
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy hasil build dari tahap builder
COPY --from=builder /app/dist ./dist

# Expose port yang digunakan oleh serve
EXPOSE 80

# Jalankan aplikasi menggunakan serve
CMD ["serve", "-s", "dist"]