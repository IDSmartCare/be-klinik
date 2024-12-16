import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dataPoli = [
    {
      name: 'Poli Anak',
      url: 'polianak',
    },
    {
      name: 'Poli Bedah',
      url: 'polibedah',
    },
    {
      name: 'Poli Gigi',
      url: 'poligigi',
    },
    {
      name: 'Poli Gizi',
      url: 'poligizi',
    },
    {
      name: 'Poli Imunisasi',
      url: 'poliimunisasi',
    },
    {
      name: 'Poli Kebidanan dan Kandungan',
      url: 'polikebidanandankandungan',
    },
    {
      name: 'Poli Kesehatan Ibu dan Anak',
      url: 'polikesehatanibudananak',
    },
    {
      name: 'Poli Kulit dan Kelamin',
      url: 'polikulitdankelamin',
    },
    {
      name: 'Poli lansia',
      url: 'polilansia',
    },
    {
      name: 'Poli Mata',
      url: 'polimata',
    },
    {
      name: 'Poli Ortopedi',
      url: 'poliortopedi',
    },
    {
      name: 'Poli Penyakit Dalam',
      url: 'polipenyakitdalam',
    },
    {
      name: 'Poli Psikologi dan Psikiatri',
      url: 'polipsikologidanpsikiatri',
    },
    {
      name: 'Poli Rehabilitas Medis',
      url: 'polirehabilitasmedis',
    },
    {
      name: 'Poli Saraf',
      url: 'polisaraf',
    },
    {
      name: 'Poli THT',
      url: 'politht',
    },
    {
      name: 'Poli Umum',
      url: 'poliumum',
    },
  ];

  for (const poli of dataPoli) {
    await prisma.masterVoicePoli.create({
      data: {
        idFasyankes: null,
        namaPoli: poli.name,
        url: `https://is3.cloudhost.id/efile/voice-poli-idsc/${poli.url}.mp3`,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
