import { useEffect } from "react";

const ADSENSE_CLIENT = "ca-pub-9229056617068297";

/**
 * Loads the Google AdSense script so auto-ads can place ads on this page.
 *
 * Mount this ONLY on content-rich pages. Keeping the loader off thin screens
 * (login, profile, messages, chat) is what keeps the site compliant with
 * AdSense's "Google-served ads on screens without publisher-content" policy.
 *
 * On a client-side route change away from a content page, auto-ads will not
 * re-scan (no full page-load event), so no ad is injected onto the new screen.
 */
export default function AdSense() {
  useEffect(() => {
    if (document.getElementById("adsbygoogle-js")) return;
    const s = document.createElement("script");
    s.id = "adsbygoogle-js";
    s.async = true;
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  }, []);

  return null;
}