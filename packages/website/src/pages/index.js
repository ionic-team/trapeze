import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

import snippets from './assets/snippets.js';
import snippetsAutomate from './assets/snippets-automate.js';

import Image from '@theme/IdealImage';

import styles from './index.module.scss';
import IconExternalLink from '@theme/Icon/ExternalLink';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`Hello from ${siteConfig.title}`} description="Description will go into a meta tag in <head />">
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
            <IconExternalLink />
          </a>
        </div>
        <Image img={require('/img/index/top-0.png')} width={117.23} height={14} />
      </div>
    </header>
  );
}

function Features() {
  return (
    <section id="features" className={clsx('container', styles.features)}>
      <ul className="row clean-list">
        <li className="col col--4">
          <Image img={require('/img/index/features-0.png')} width={40} height={40} />
          <h3>Easy to Use</h3>
          <p className={styles.p3}>
            Trapeze modifies native iOS and Android projects with a simple configuration-driven experience or
            Node.js-based API.
          </p>
        </li>
        <li className="col col--4">
          <Image img={require('/img/index/features-1.png')} width={40} height={40} />
          <h3>Great Mobile Support</h3>
          <p className={styles.p3}>
            Trapeze works with most popular mobile frameworks—traditional iOS and Android, Capacitor, React Native, and
            Flutter.
          </p>
        </li>
        <li className="col  col--4">
          <Image img={require('/img/index/features-2.png')} width={58} height={32} />
          <h3>CI/CD Ready</h3>
          <p className={styles.p3}>
            Trapeze integrates well into Mobile CI/CD and DevOps services like Appflow for powerful project automation
            at scale.
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
              Write custom iOS and Android configuration scripts using the powerful Trapeze API
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
            <p className={styles.p2}>Pull values from environment variables for easy templating and customization.</p>
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
            <a className={styles.community__card}>
              <div className={styles['community__card__image-wrapper']}>
                <Image img={require('/img/index/community-0.png')} width={30} height={24} />
              </div>
              <h3>Twitter</h3>
              <p className={styles.p4}>For announcements, blog posts, and general Trapeze news.</p>
            </a>
          </li>
          <li className="col">
            <a className={styles.community__card}>
              <div className={styles['community__card__image-wrapper']}>
                <Image img={require('/img/index/community-1.png')} width={34} height={27.55} />
              </div>
              <h3>Discord</h3>
              <p className={styles.p4}>To get involved in the community, ask questions, and share tips.</p>
            </a>
          </li>
          <li className="col">
            <a className={styles.community__card}>
              <div className={styles['community__card__image-wrapper']}>
                <Image img={require('/img/index/community-2.png')} width={28} height={28} />
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
