import React from 'react';
import Layout from '@theme-original/Layout';
import PlatformBar from '../../components/PlatformBar';

export default function LayoutWrapper(props) {
  return (
    <>
      <PlatformBar />
      <Layout {...props} />
    </>
  );
}
