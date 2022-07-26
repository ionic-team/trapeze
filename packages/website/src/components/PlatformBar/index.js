import React from 'react';
import clsx from 'clsx';

import styles from './index.module.scss';

export default function PlatformBar(props) {
  return (
    <div {...props} className={clsx('platform-bar', styles.platformBar, props.className)}>
      <a href="https://ionic.io" className={styles.start}>
        <svg width="70" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M66.943 14.19c-.329.883-1.148 1.373-2.16 1.373a2.72 2.72 0 1 1 0-5.44c1.012 0 1.806.432 2.16 1.373h2.775c-.46-2.414-2.468-3.963-4.936-3.963a5.31 5.31 0 1 0 0 10.62c2.469 0 4.602-1.734 4.936-3.963h-2.775ZM55.515 7.8h2.89v10.165h-2.89V7.8ZM58.695 5.344a1.744 1.744 0 1 1-3.488-.001 1.744 1.744 0 0 1 3.488 0ZM47.24 9.044c.484-.874 1.585-1.471 3.17-1.471 2.564 0 3.92 1.63 3.92 4.052v6.34h-2.89v-6.037c0-1.186-.528-2.001-1.805-2.001-1.4 0-2.176.857-2.176 2.211v5.818H44.57V7.8h2.67v1.244Z"
            fill="#fff"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M38.324 15.563a2.72 2.72 0 1 0 .001-5.44 2.72 2.72 0 0 0-.001 5.44Zm0 2.59a5.31 5.31 0 1 0 0-10.62 5.31 5.31 0 1 0 0 10.62Z"
            fill="#fff"
          />
          <path
            d="M29.109 7.8h2.889v10.165h-2.89V7.8ZM32.288 5.344a1.744 1.744 0 1 1-3.487-.001 1.744 1.744 0 0 1 3.488 0Z"
            fill="#fff"
          />
          <path
            d="M2.88 12A9.12 9.12 0 0 1 12 2.88c2.028 0 3.9.66 5.414 1.78a3.437 3.437 0 0 1 2.184-1.949A11.955 11.955 0 0 0 12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12c0-1.387-.236-2.721-.67-3.963a3.424 3.424 0 0 1-2.579 1.387A9.12 9.12 0 1 1 2.88 12Z"
            fill="url(#a)"
          />
          <path
            opacity=".3"
            d="M23.753 9.569a11.927 11.927 0 0 0-.423-1.532 3.424 3.424 0 0 1-2.579 1.387c.17.577.284 1.178.336 1.798a3.75 3.75 0 0 0 2.666-1.653Z"
            fill="#000"
          />
          <path
            d="M12 17.25A5.256 5.256 0 0 0 17.25 12 5.256 5.256 0 0 0 12 6.75 5.256 5.256 0 0 0 6.75 12 5.259 5.259 0 0 0 12 17.25ZM19.875 7.5a2.625 2.625 0 1 0 0-5.25 2.625 2.625 0 0 0 0 5.25Z"
            fill="#fff"
          />
          <defs>
            <radialGradient
              id="a"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="matrix(8.55 -3.15 3.19347 8.66796 12 12)"
            >
              <stop stop-color="#fff" stop-opacity=".8" />
              <stop offset=".115" stop-color="#fff" />
              <stop offset="1" stop-color="#fff" />
            </radialGradient>
          </defs>
        </svg>
      </a>
      <span className={styles.end}>
        <em>Trapeze</em> is part of the <a href="https://ionic.io">Ionic Ecosystem →</a>
      </span>
    </div>
  );
}
