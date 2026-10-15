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

    // Remove the script when this component unmounts (e.g. navigating away
    // from the only page that should show ads). Without this, the auto-ads
    // library stays loaded across SPA route changes and can inject ads onto
    // low-content screens like login/register — an AdSense policy violation.
    return () => {
      const existing = document.getElementById("adsbygoogle-js");
      if (existing) existing.remove();
      // Best-effort: clear the global so auto-ads stops monitoring the DOM.
      try { delete window.adsbygoogle; } catch { window.adsbygoogle = undefined; }
    };
  }, []);

  return null;
}