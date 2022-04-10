module.exports = {
  title: 'Cap\'n Config',
  tagline: 'Naitve iOS and Android project management and automation tool',
  url: 'https://ionic.io',
  trailingSlash: false,
  baseUrl: '/docs/cap-config/',
  baseUrlIssueBanner: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.png',
  organizationName: 'ionic-team',
  projectName: 'cap-config',
  titleDelimiter: '-',
  themeConfig: {
    prism: {
      additionalLanguages: ['java', 'groovy'],
    },
    navbar: {
      title: 'Cap\'n Config',
      logo: {
        alt: 'Cap Config Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          label: 'Platform',
          position: 'right',
          items: [
            {
              href: 'https://capacitorjs.com/docs',
              label: 'Capacitor',
              target: '_blank',
              rel: null,
              className: 'link--outbound',
            },
            {
              href: 'https://ionicframework.com/docs',
              label: 'Framework',
              target: '_blank',
              rel: null,
              className: 'link--outbound',
            },
            {
              href: 'https://ionic.io/docs/appflow',
              label: 'Appflow',
              target: null,
              rel: null,
            },
            {
              to: 'https://ionic.io/docs/identity-vault',
              label: 'Identity Vault',
            },
            {
              href: 'https://ionic.io/docs/auth-connect',
              label: 'Auth Connect',
              target: null,
              rel: null,
            },
            {
              href: 'https://ionic.io/docs/secure-storage',
              label: 'Secure Storage',
              target: null,
              rel: null,
            },
            {
              href: 'https://ionic.io/docs/premier-plugins',
              label: 'Premier Plugins',
              target: null,
              rel: null,
            },
          ],
        },
      ],
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
    tagManager: {
      trackingID: 'GTM-TKMGCBC',
    },
    prism: {
      theme: { plain: {}, styles: [] },
      additionalLanguages: ['shell-session', 'java', 'groovy'],
    },
  },
  plugins: ['@ionic-internal/docusaurus-plugin-tag-manager', 'docusaurus-plugin-sass'],
  themes: ['@ionic-internal/docusaurus-theme'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        pages: false,
        theme: {
          customCss: ['prismjs/themes/prism-tomorrow.css'],
        },
      },
    ],
  ],
};
