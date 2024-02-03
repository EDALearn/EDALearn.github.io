const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://edalearn.github.io',
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    logo: '/event-driven-architectures-logo-transparent.png',
    logoLink: 'https://edalearn.github.io',
    title: "EDA Learn",
    githubUrl: 'https://github.com/EDALearn/EDALearn.github.io',
    helpUrl: '',
    tweetText: '',
    social: ``,
    links: [{ text: 'First Link', link: 'https://github.com/EDALearn/EDALearn.github.io' }],
    search: {
      enabled: false,
      indexName: '',
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  sidebar: {
    forcedNavOrder: [
      '/getting-started', // add trailing slash if enabled above
      '/EDAPatterns',
      '/EDAProjects'
    ],
    collapsedNav: [
      '/codeblock', // add trailing slash if enabled above
    ],
    links: [{ text: 'First Sidebar Link', link: 'https://github.com/EDALearn/EDALearn.github.io' }],
    frontLine: false,
    ignoreIndex: true,
    title: "Learning - Resources",
  },
  siteMetadata: {
    title: 'EDALearn',
    description: 'Community Driven Resources and Sample Projects to Learn about Event-Driven Architectures.',
    ogImage: null,
    docsLocation: '',
    favicon: '',
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {
      name: 'EDA Learn',
      short_name: 'EDALearn',
      start_url: '/',
      background_color: '#6b37bf',
      theme_color: '#6b37bf',
      display: 'standalone',
      crossOrigin: 'use-credentials',
      icons: [
        {
          src: 'src/pwa-512.png',
          sizes: `512x512`,
          type: `image/png`,
        },
      ],
    },
  },
};

module.exports = config;
