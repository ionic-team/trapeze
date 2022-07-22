import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

import snippets from './assets/snippets.js';
import snippetsAutomate from './assets/snippets-automate.js';

import Image from '@theme/IdealImage';

import styles from './index.module.css';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`Hello from ${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <main>
        <Top />
        <Features />
        <Automate />
        <Customize />
        <Variables />
        <CICD />
      </main>
    </Layout>
  );
}

function Top() {
  return (
    <header id="top" className={styles.top}>
      <div className="container">
        <h1 className={styles.hero__title}>
          Configure your mobile
          <br /> apps with <em>confidence.</em>
        </h1>
        <p className={styles.hero__subtitle}>A simple, easy to use native mobile project configuration tool and API.</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/">
            Get Started →
          </Link>
          <a
            className="button button--secondary button--lg"
            href="https://github.com/ionic-team/trapeze"
            target="_blank"
            rel="noopener"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}

function Features() {
  return (
    <section id="features" className={clsx('container', styles.features)}>
      <ul>
        <li>
          <Image img={require('/img/index/features-0.png')} width={40} height={40} />
          <h3>Easy to Use</h3>
          <p>
            Trapeze modifies native iOS and Android projects with a simple configuration-driven experience or
            Node.js-based API.
          </p>
        </li>
        <li>
          <Image img={require('/img/index/features-1.png')} width={40} height={40} />
          <h3>Great Mobile Support</h3>
          <p>
            Trapeze works with most popular mobile frameworks—traditional iOS and Android, Capacitor, React Native, and
            Flutter.
          </p>
        </li>
        <li>
          <Image img={require('/img/index/features-2.png')} width={58} height={32} />
          <h3>CI/CD Ready</h3>
          <p>
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
      <div className={clsx('container', styles.column)}>
        <div className="start">
          <div className={styles.overline}>Automate</div>
          <h2>Automate your tasks.</h2>
          <p>Automate many common iOS and Android configuration tasks with a single YAML-based configuration.</p>
          <div>
            {tabs.map((tab, i) => (
              <button onClick={() => setActiveTab(i)}>
                <span>{tab}</span>
                <span>{tab} platform tasks</span>
              </button>
            ))}
          </div>
        </div>
        <div className="end">
          {tabs.map((tab, i) => {
            const { language, code } = snippetsAutomate[tab];

            return (
              <CodeBlock key={i} language={language}>
                {code}
              </CodeBlock>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Customize() {
  const { customize } = snippets;

  return (
    <section id="customize">
      <div className={clsx('container', styles.column)}>
        <div className="start">
          <div className={styles.overline}>Customizable</div>
          <h2>Custom config scripts.</h2>
          <p>Write custom iOS and Android configuration scripts using the powerful Trapeze API</p>
        </div>
        <div className="end">
          {customize.map(({ language, code }, i) => (
            <CodeBlock key={i} language={language}>
              {code}
            </CodeBlock>
          ))}
        </div>
      </div>
    </section>
  );
}

function Variables() {
  const { variables } = snippets;

  return (
    <section id="customize">
      <div className={clsx('container', styles.column)}>
        <div className="start">
          <div className={styles.overline}>Variables</div>
          <h2>Environment variables</h2>
          <p>Pull values from environment variables for easy templating and customization.</p>
        </div>
        <div className="end">
          {variables.map(({ language, code }, i) => (
            <CodeBlock key={i} language={language}>
              {code}
            </CodeBlock>
          ))}
        </div>
      </div>
    </section>
  );
}

function CICD() {
  const { cicd } = snippets;

  return (
    <section id="customize">
      <div className={clsx('container', styles.column)}>
        <div className="start">
          <div className={styles.overline}>Automation</div>
          <h2>Automate with ease.</h2>
          <p>Automate configuration in a CI/CD workflow, such as Appflow Code.</p>
        </div>
        <div className="end">
          {cicd.map(({ language, code }, i) => (
            <CodeBlock key={i} language={language}>
              {code}
            </CodeBlock>
          ))}
        </div>
      </div>
    </section>
  );
}
