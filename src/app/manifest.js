export default function manifest() {
  return {
    name: 'Nihad KP - Digital Ventures',
    short_name: 'Nihad KP',
    description: 'Portfolio of Mohammed Nihad KP - Building Scalable Digital Ventures & Strategic Business Solutions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/nkp-logo.png', // Fallback, recommend adding real 192x192 and 512x512 icons later
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
