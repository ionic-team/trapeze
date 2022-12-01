// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/oceanicNext');
const darkCodeTheme = require('prism-react-renderer/themes/palenight');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Trapeze - Easy mobile project configuration',
  tagline: 'Native mobile project configuration tool and API',
  url: 'https://trapeze.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.png',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ionic-team', // Usually your GitHub org/user name.
  projectName: 'trapeze', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: 'https://github.com/ionic-team/trapeze/tree/main/packages/website/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'Trapeze Logo',
          src: 'img/logo.svg',
          width: 110,
          height: 28,
        },
        items: [
          {
            type: 'search',
            position: 'right',
          },
          {
            className: 'link-text',
            href: '/docs',
            label: 'Docs',
            position: 'right',
          },
          {
            className: 'link-text',
            href: '/docs/project-api',
            label: 'API',
            position: 'right',
          },
          {
            type: 'html',
            position: 'right',
            value: '<div class="separator"></div>',
          },
          {
            className: 'link-icon',
            href: 'https://twitter.com/trapezedev',
            target: '_blank',
            rel: 'noopener',
            html: '<svg width="18" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 1.9c-.68.32-1.39.54-2.12.63A4 4 0 0 0 17.5.3c-.72.47-1.52.8-2.34.98-.35-.4-.77-.73-1.23-.95A3.4 3.4 0 0 0 12.46 0c-2.04 0-3.7 1.8-3.7 4.04 0 .3.04.62.1.92a9.7 9.7 0 0 1-4.2-1.22 10.8 10.8 0 0 1-3.4-3c-.34.61-.5 1.31-.51 2.03 0 1.4.66 2.63 1.65 3.36a3.38 3.38 0 0 1-1.68-.5v.04a3.97 3.97 0 0 0 2.96 3.96 3.42 3.42 0 0 1-1.66.07 3.76 3.76 0 0 0 3.45 2.8A7.01 7.01 0 0 1 0 14.18 9.7 9.7 0 0 0 5.65 16c6.8 0 10.52-6.15 10.52-11.5L16.16 4A7.94 7.94 0 0 0 18 1.89Z" fill="#556170" /></svg>',
            position: 'right',
          },
          {
            className: 'link-icon',
            href: 'https://discord.com/invite/UPYYRhtyzp',
            target: '_blank',
            rel: 'noopener',
            html: '<svg width="20" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.93 1.33A15.93 15.93 0 0 0 12.86 0c-.03 0-.05 0-.07.03-.17.33-.37.76-.5 1.1a14.52 14.52 0 0 0-4.57 0A11.3 11.3 0 0 0 7.2.03.06.06 0 0 0 7.14 0a15.89 15.89 0 0 0-4.1 1.35 18.4 18.4 0 0 0-2.93 12 16.3 16.3 0 0 0 5 2.65c.02 0 .05 0 .06-.03.39-.55.73-1.13 1.02-1.74a.07.07 0 0 0-.03-.1 10.7 10.7 0 0 1-1.56-.77.07.07 0 0 1 0-.12l.3-.25a.06.06 0 0 1 .07-.01 11.32 11.32 0 0 0 10.05 0h.06c.1.1.21.18.32.26.03.03.03.1-.01.12-.5.3-1.02.56-1.56.78a.07.07 0 0 0-.04.09c.3.6.65 1.2 1.03 1.74.01.03.04.04.07.03a16.24 16.24 0 0 0 5.02-2.7 18.26 18.26 0 0 0-2.98-11.97ZM6.68 10.9c-.98 0-1.8-.95-1.8-2.11 0-1.17.8-2.12 1.8-2.12 1.01 0 1.82.96 1.8 2.12 0 1.16-.8 2.11-1.8 2.11Zm6.65 0c-.99 0-1.8-.95-1.8-2.11 0-1.17.8-2.12 1.8-2.12s1.81.96 1.8 2.12c0 1.16-.8 2.11-1.8 2.11Z" fill="#556170"/></svg>',
            position: 'right',
          },
          {
            className: 'link-icon',
            href: 'https://github.com/ionic-team/trapeze',
            target: '_blank',
            rel: 'noopener',
            html: '<svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 0C4.03 0 0 4.13 0 9.23a9.21 9.21 0 0 0 6.16 8.75c.05.02.1.02.15.02.33 0 .46-.25.46-.46l-.01-1.57c-.34.08-.64.1-.91.1-1.73 0-2.13-1.34-2.13-1.34-.4-1.06-1-1.35-1-1.35-.78-.55 0-.56.06-.56.9.08 1.38.95 1.38.95.45.8 1.06 1.01 1.6 1.01.42 0 .8-.13 1.02-.24a2 2 0 0 1 .57-1.23c-2-.24-4.1-1.03-4.1-4.56 0-1.01.35-1.84.93-2.48a3.4 3.4 0 0 1 .09-2.44s.06-.02.2-.02c.32 0 1.06.12 2.27.97a8.43 8.43 0 0 1 4.51 0c1.21-.85 1.95-.97 2.27-.97.14 0 .2.02.2.02a3.4 3.4 0 0 1 .1 2.44c.57.65.92 1.47.92 2.48 0 3.54-2.1 4.32-4.11 4.55.32.28.6.85.6 1.7v2.54c0 .21.12.46.45.46.05 0 .1 0 .16-.02A9.21 9.21 0 0 0 18 9.23C18 4.13 13.97 0 9 0Z" fill="#556170"/></svg>',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        logo: {
          alt: 'Ionic Logo',
          src: 'img/logo-footer.svg',
          href: '/',
          width: 80,
          height: 21,
        },
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Overview',
                to: '/docs',
              },
              {
                label: 'Configuration Tool',
                to: '/docs/operations/getting-started',
              },
              {
                label: 'API',
                to: '/docs/project-api',
              },
              {
                label: 'CI/CD',
                to: '/docs/ci-cd',
              },
            ],
          },
          {
            title: 'Frameworks',
            items: [
              {
                label: 'Native iOS',
                to: '/docs/frameworks/native-ios',
              },
              {
                label: 'Native Android',
                to: '/docs/frameworks/native-android',
              },
              {
                label: 'Capacitor',
                to: '/docs/frameworks/capacitor',
              },
              {
                label: 'React Native',
                to: '/docs/frameworks/react-native',
              },
              {
                label: 'Flutter',
                to: '/docs/frameworks/flutter',
              },
            ],
          },
          {
            title: 'Social',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/ionic-team/trapeze',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/trapezedev',
              },
              {
                label: 'Discord',
                href: 'https://discord.com/invite/UPYYRhtyzp',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()}  |  MIT License`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['yaml'],
      },
      colorMode: { defaultMode: 'light', disableSwitch: true, respectPrefersColorScheme: false },
      tagManager: {
        trackingID: 'GTM-TKMGCBC',
      },
      algolia: {
        appId: 'R7DDMNY34C',
        apiKey: '0e6f4d0738f04128de55343eeeb38f38',
        indexName: 'trapeze',
        contextualSearch: true,
      },
    }),

  plugins: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 60,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        disableInDev: false,
      },
    ],
    'docusaurus-plugin-sass',
    '@ionic-internal/docusaurus-plugin-tag-manager',
  ],
};

module.exports = config;
