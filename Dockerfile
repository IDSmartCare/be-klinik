# Tahap 1: Build Stage
# Menggunakan image Node.js 20.17.0 dengan Alpine sebagai base image untuk membangun aplikasi
FROM dns-regs.dnstech.co.id/library/node:20.17.0-alpine AS img-builder

# Set environment variable untuk menentukan mode produksi
ENV NODE_ENV development

# Set working directory
WORKDIR /app

RUN chown node:node /app

# Copy package.json dan package-lock.json untuk caching dependensi
COPY package*.json ./

USER node

# Install semua dependensi, termasuk Prisma
RUN npm install

# Copy seluruh kode sumber ke dalam image
COPY . ./

#RUN cp .env.docker .env

# Generate Prisma client dan build aplikasi
RUN npx prisma generate && npm run build

# Debugging: cek hasil salinan
RUN pwd && ls -alsh node_modules

#RUN npm run build

# Tahap 2: Build Engine Stage
# Menggunakan image Node.js 20.17.0 dengan Alpine sebagai base image untuk membangun aplikasi
FROM dns-regs.dnstech.co.id/library/node:20.17.0-alpine AS engine-builder

# Set environment variable untuk menentukan mode produksi
ENV NODE_ENV production

WORKDIR /app

COPY --chown=node:node --from=img-builder /app/prisma/schema prisma/schema
COPY --chown=node:node --from=img-builder /app/prisma/seed.ts prisma/

# Salin file prisma client dari img-builder
COPY --chown=node:node   --from=img-builder  /app/node_modules/.prisma/client node_modules/.prisma/client
COPY --chown=node:node   --from=img-builder  /app/node_modules/ts-node node_modules/

# Debugging: cek hasil salinan
RUN pwd && ls -alsh node_modules

# Tahap 3: Production Stage
# Menggunakan image Node.js 20.17.0 dengan Alpine sebagai base image untuk lingkungan produksi
FROM dns-regs.dnstech.co.id/library/node:20.17.0-alpine

# Set environment variable untuk menentukan mode produksi
ENV NODE_ENV production

# Set environment variable untuk menentukan mode produksi
#ENV NODE_ENV development

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Instal dependensi tambahan (libssl untuk dependensi terkait OpenSSL, dumb-init untuk inisialisasi proses)
RUN apk update && apk add --no-cache openssl dumb-init curl

# Salin hasil build (dist) dari tahap build ke container produksi
COPY --chown=node:node --from=img-builder /app/dist dist/

# Salin file .env dari tahap build ke container produksi
#COPY --chown=node:node --from=img-builder /app/.env .env

# Salin file package.json dan package-lock.json dari tahap build untuk memastikan dependensi yang sama di lingkungan produksi
COPY --chown=node:node --from=img-builder /app/package.json .
COPY --chown=node:node --from=img-builder /app/package-lock.json .

# Install dependensi untuk produksi (mengabaikan dev dependencies)
RUN npm install --omit=dev 

# Debugging: cek hasil salinan
RUN pwd && ls -alsh node_modules

# Salin file prisma client dari img-builder
COPY --chown=node:node --from=img-builder  /app/node_modules/.prisma/client node_modules/.prisma/client

COPY --chown=node:node --from=img-builder /app/node_modules/ts-node node_modules/

COPY --chown=node:node --from=engine-builder /app/prisma/ prisma/

# Debugging: cek hasil salinan
RUN pwd && ls -alsh node_modules

# Expose port 3000 yang akan digunakan oleh aplikasi
EXPOSE 80

# Jalankan aplikasi menggunakan dumb-init untuk menangani sinyal proses dengan benar
CMD ["dumb-init", "node", "dist/src/main.js"]
