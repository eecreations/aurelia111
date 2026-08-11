import type { CapacitorConfig } from "@capacitor/cli";

/**
 * iOS shell configuration. The native `ios/` project is generated locally:
 * see the "iOS / App Store" section of the README.
 */
const config: CapacitorConfig = {
  appId: "app.lovable.aurelia",
  appName: "Aurelia",
  webDir: "dist/client",
  ios: {
    contentInset: "always",
    backgroundColor: "#061210",
  },
  plugins: {
    SplashScreen: {
      backgroundColor: "#061210",
      showSpinner: false,
      launchAutoHide: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#061210",
    },
  },
};

export default config;
