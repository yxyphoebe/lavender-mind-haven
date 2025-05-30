
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c00eb517aca2490ca1b18cca6472e0a2',
  appName: 'Mindful AI',
  webDir: 'dist',
  server: {
    url: 'https://c00eb517-aca2-490c-a1b1-8cca6472e0a2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#fcfbff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#fcfbff',
    },
  },
};

export default config;
