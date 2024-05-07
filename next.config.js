module.exports = {
  devIndicators: {
    buildActivity: false
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ]
  },
  images: {
    domains: ["fecovitati.sharepoint.com"]
  },
  headers: () => [
    {
      source: '/home',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
      ],
    },
  ],
}
