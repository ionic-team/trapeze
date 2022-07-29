import Image from '@theme/IdealImage';
import React from 'react';
import FooterLogo from '@theme/Footer/Logo';
import LinkItem from '@theme/Footer/LinkItem';

import { useThemeConfig } from '@docusaurus/theme-common';
import clsx from 'clsx';

import styles from './index.module.scss';

export default function Footer() {
  const { footer } = useThemeConfig();

  if (!footer) {
    return null;
  }

  const { copyright, links, logo, style } = footer;

  return (
    <footer className={clsx('footer', styles.footer)}>
      <div className="container">
        <div className="row">
          <div className="col col--4">
            {logo && <FooterLogo logo={logo} />}
            <div className={styles.footer__copyright}>{copyright}</div>
            <div className={styles.footer__description}>
              A project by <a href="https://ionic.io">Ionic.</a>
            </div>
          </div>
          {links.map(({ title, items }, i) => (
            <div key={i} className={clsx(`col col--${i === links.length - 1 ? 2 : 3}`)}>
              <h3 className="footer__title">{title}</h3>
              <ul className="footer__items clean-list">
                {items.map((props, i) => (
                  <li key={i}>
                    <LinkItem key={i} item={props} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
