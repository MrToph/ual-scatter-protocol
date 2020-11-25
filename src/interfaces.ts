import { isMobile } from "./utils";

export const DesktopName: string = "Scatter";
export const WombatName: string = "Wombat";
export const MathWalletName: string = "MathWallet";

export const Name: string = (() => {
  if (isMobile()) {
    if (typeof window === `undefined`) return DesktopName;
    if (window.navigator.userAgent.includes(`MathWallet`)) return MathWalletName;
  }

  return DesktopName;
})();
