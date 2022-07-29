/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import styles from './styles.module.scss';

export default function IconExternalLink({ width = 14, height = 14 }) {
  return (
    <svg
      width={width}
      height={height}
      className={styles.iconExternalLink}
      aria-hidden={true}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m9.81 9.4-.19-3.97-5.64 5.64-.89-.9 5.64-5.64-3.97-.18.02-1.25 5.97.3.3 5.98-1.24.02Z" fill="#B2BECD" />
    </svg>
  );
}
