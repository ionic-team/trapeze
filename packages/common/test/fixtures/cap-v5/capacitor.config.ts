import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'cap-v5-test',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
