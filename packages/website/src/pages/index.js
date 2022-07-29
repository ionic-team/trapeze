import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

import snippets from './_assets/snippets.js';
import snippetsAutomate from './_assets/snippets-automate.js';

import Image from '@theme/IdealImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './index.module.scss';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout description={siteConfig.tagline}>
      <main className={styles.page}>
        <Top />
        <Features />
        <Automate />
        <Customize />
        <Variables />
        <CICD />
        <Community />
      </main>
    </Layout>
  );
}

function Top() {
  return (
    <header id="top" className={styles.top}>
      <div className="container">
        <h1 className={styles.top__title}>
          Configure your mobile
          <br /> apps with <em>confidence.</em>
        </h1>
        <p className={clsx(styles.p2, styles.top__description)}>
          A simple, easy to use native mobile project configuration tool and API.
        </p>
        <div className={styles.top__buttons}>
          <Link className="button button--primary" to="/docs/">
            Get Started →
          </Link>
          <a
            className="button button--secondary"
            href="https://github.com/ionic-team/trapeze"
            target="_blank"
            rel="noopener"
          >
            GitHub
            <svg width="10" height="10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.38.47c0 .26-.21.47-.47.47H1.25a.31.31 0 0 0-.31.31v7.5c0 .17.14.31.31.31h7.5c.17 0 .31-.14.31-.31V6.09a.47.47 0 0 1 .94 0v2.66C10 9.44 9.44 10 8.75 10h-7.5C.56 10 0 9.44 0 8.75v-7.5C0 .56.56 0 1.25 0h2.66c.26 0 .46.21.46.47Zm5.15 3.9a.47.47 0 0 1-.47-.46V1.6L4.33 6.33a.47.47 0 0 1-.66-.66L8.4.94H6.1a.47.47 0 0 1 0-.94h3.28c.34 0 .62.28.62.63V3.9c0 .26-.21.46-.47.46Z"
                fill="#677483"
              />
            </svg>
          </a>
        </div>
        {/* <img src={useBaseUrl('/img/index/top-0.png')} width={117.23} height={14} /> */}
        <Image
          img={require('/img/index/top-0.png')}
          style={{ width: 117.23, height: 14 }}
          className={styles['top__image-sprite']}
        />
      </div>
    </header>
  );
}

function Features() {
  return (
    <section id="features" className={clsx('container', styles.features)}>
      <ul className="row clean-list">
        <li className="col col--4">
          <Image img={require('/img/index/features-0.png')} style={{ width: 40, height: 40 }} />
          <h3>Easy to Use</h3>
          <p className={styles.p3}>
            Trapeze modifies native iOS and Android projects with a simple configuration-driven experience or
            Node.js-based API.
          </p>
        </li>
        <li className="col col--4">
          <Image img={require('/img/index/features-1.png')} style={{ width: 40, height: 40 }} />
          <h3>Great Mobile Support</h3>
          <p className={styles.p3}>
            Trapeze works with most popular mobile frameworks—traditional iOS and Android, Capacitor, React Native, and
            Flutter.
          </p>
        </li>
        <li className="col  col--4">
          <Image img={require('/img/index/features-2.png')} style={{ width: 58, height: 32 }} />
          <h3>CI/CD Ready</h3>
          <p className={styles.p3}>
            Trapeze integrates well into Mobile CI/CD and DevOps services like{' '}
            <a href="https://ionic.io/appflow" rel="noopener" target="_blank">
              Appflow
            </a>{' '}
            for powerful project automation at scale.
          </p>
        </li>
      </ul>
    </section>
  );
}

function Automate() {
  const tabs = Object.keys(snippetsAutomate);

  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="automate" className={styles.automate}>
      <div className="container">
        <div className="row row--align-center">
          <div className="col col--5">
            <div className={styles.overline}>Automate</div>
            <h2>Automate your tasks.</h2>
            <p className={styles.p2}>
              Automate many common iOS and Android configuration tasks with a single YAML-based configuration.
            </p>
            <div className={styles.automate__buttons}>
              {tabs.map((tab, i) => (
                <button
                  onClick={() => setActiveTab(i)}
                  className={clsx(styles.automate__button, {
                    [styles['automate__button--active']]: activeTab === i,
                  })}
                >
                  <h3 className={styles['automate__button-title']}>{tab}</h3>
                  <p className={styles.p4}>{tab} platform tasks</p>
                </button>
              ))}
            </div>
          </div>
          <div className={clsx(styles.automate__end, 'col col--offset-1 col--6')}>
            {tabs.map((tab, i) => {
              const { language, code } = snippetsAutomate[tab];

              return (
                <CodeBlock
                  key={i}
                  language={language}
                  className={clsx({ [styles['automate__end--active']]: activeTab === i })}
                >
                  {code}
                </CodeBlock>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Customize() {
  const { customize } = snippets;

  return (
    <section id="customize" className={styles.customize}>
      <div className={clsx('container')}>
        <div className="row row--align-center">
          <div className="col col--5">
            <div className={styles.overline}>Customizable</div>
            <h2>Custom config scripts.</h2>
            <p className={styles.p2}>
              Write custom iOS and Android configuration scripts using the powerful{' '}
              <Link autoAddBaseUrl href="/docs/project-api">
                Trapeze API
              </Link>
            </p>
          </div>
          <div className="col col--6 col--offset-1">
            {customize.map(({ language, code }, i) => (
              <CodeBlock key={i} language={language}>
                {code}
              </CodeBlock>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Variables() {
  const { variables } = snippets;

  return (
    <section id="variables" className={styles.variables}>
      <div className={clsx('container')}>
        <div className="row row--align-center">
          <div className="col col--5">
            <div className={styles.overline}>Variables</div>
            <h2>Environment variables</h2>
            <p className={styles.p2}>
              Pull values from environment variables for easy templating and customization. Supports JSON values that
              can even reference existing variables.
            </p>
          </div>
          <div className="col col--6 col--offset-1">
            {variables.map(({ language, code }, i) => (
              <CodeBlock key={i} language={language}>
                {code}
              </CodeBlock>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CICD() {
  const { cicd } = snippets;

  return (
    <section id="cicd" className={styles.cicd}>
      <div className={clsx('container')}>
        <div className="row row--align-center">
          <div className="col col--5">
            <div className={styles.overline}>Automation</div>
            <h2>Automate with ease.</h2>
            <p className={styles.p2}>Automate configuration in a CI/CD workflow, such as Appflow Code.</p>
          </div>
          <div className="col col--6 col--offset-1">
            {cicd.map(({ language, code }, i) => (
              <CodeBlock key={i} language={language}>
                {code}
              </CodeBlock>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Community() {
  return (
    <section id="community" className={styles.community}>
      <div className="container">
        <header>
          <h2>Community</h2>
          <p className={styles.p2}>
            Trapeze is an open source project by Ionic. Join our growing community—everyone is welcome.
          </p>
        </header>
        <ul className={clsx(styles.community__cards, 'row row--no-gutters clean-list')}>
          <li className="col">
            <a className={styles.community__card} href="https://twitter.com/trapezedev" target="_blank" rel="noopener">
              <div className={styles['community__card__image-wrapper']}>
                <Image img={require('/img/index/community-0.png')} style={{ width: 30, height: 24 }} />
              </div>
              <h3>Twitter</h3>
              <p className={styles.p4}>
                Follow{' '}
                <code>
                  <a href="https://twitter.com/trapezedev" target="_blank">
                    @trapezedev
                  </a>
                </code>{' '}
                for announcements, blog posts, and updates.
              </p>
            </a>
          </li>
          <li className="col">
            <a
              className={styles.community__card}
              href="https://discord.com/invite/UPYYRhtyzp"
              target="_blank"
              rel="noopener"
            >
              <div className={styles['community__card__image-wrapper']}>
                <Image img={require('/img/index/community-1.png')} style={{ width: 34, height: 27.55 }} />
              </div>
              <h3>Discord</h3>
              <p className={styles.p4}>
                Join <code>#trapeze</code> to get involved in the community and ask questions.
              </p>
            </a>
          </li>
          <li className="col">
            <a
              className={styles.community__card}
              href="https://github.com/ionic-team/trapeze"
              target="_blank"
              rel="noopener"
            >
              <div className={styles['community__card__image-wrapper']}>
                <Image img={require('/img/index/community-2.png')} style={{ width: 28, height: 28 }} />
              </div>
              <h3>GitHub</h3>
              <p className={styles.p4}>File issues, request features, and contribute on our GitHub page.</p>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
