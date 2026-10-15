import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Respira — deja de gastar por ansiedad',
    short_name: 'Respira',
    description:
      'Un registro de 30 segundos al día que te ayuda a notar el patrón antes de repetirlo.',
    start_url: '/app',
    display: 'standalone',
    background_color: '#FAF6EF',
    theme_color: '#5468D4',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
