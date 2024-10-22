module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/**',
      },
    ],
  },
  i18n: {
    locales: ['fr', 'ro', 'en', 'nl'], // Supported locales
    defaultLocale: 'fr', // Default locale
    localeDetection: true, // Automatically detect locale from the user's browser settings
  },
};
