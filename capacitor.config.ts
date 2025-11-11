import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.roletaproia.app',
  appName: 'RoboRoleta',
  webDir: 'dist/public',
  server: {
    url: 'https://roboroleta.com.br',
    cleartext: true
  }
};

export default config;
