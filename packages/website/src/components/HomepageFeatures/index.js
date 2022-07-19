import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Trapeze modifies native iOS and Android projects with a simple
        configuration-driven experience or Node.js-based API
      </>
    ),
  },
  {
    title: 'Great Mobile Support',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Trapeze works with most popular mobile frameworks, including traditional
        iOS and Android, Capacitor, React Native, and Flutter.
      </>
    ),
  },
  {
    title: 'CI/CD Ready',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Trapeze integrates well into Mobile CI/CD and DevOps services like <a href="https://useappflow.com/">Appflow</a> for powerful project automation at scale
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
