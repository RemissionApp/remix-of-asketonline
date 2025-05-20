
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.45518c5918bc41bb8ba978ee9285d0aa',
  appName: 'asketonline',
  webDir: 'dist',
  server: {
    url: 'https://45518c59-18bc-41bb-8ba9-78ee9285d0aa.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#131217",
      androidScaleType: "CENTER_CROP"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#131217"
    }
  },
  android: {
    backgroundColor: "#131217"
  },
  ios: {
    backgroundColor: "#131217"
  }
};

export default config;
