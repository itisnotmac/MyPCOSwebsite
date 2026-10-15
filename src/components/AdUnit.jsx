import { useEffect } from "react";

const ADSENSE_CLIENT = "ca-pub-9229056617068297";

// Replace this with your real AdSense ad slot ID after creating a display ad
// unit in your AdSense dashboard (Ads → By ad unit → Display ads → copy the
// data-ad-slot value).
const AD_SLOT_ID = "XXXXXXXXXX";

/**
 * Manual AdSense ad unit. Unlike auto-ads, this only shows an ad exactly
 * where this component is placed — Google will NOT inject ads anywhere else.
 *
 * IMPORTANT: make sure auto-ads is DISABLED in your AdSense dashboard
 * (Ads → Auto ads → turn it off). Otherwise the script will still
 * auto-inject ads onto low-content pages even with manual units in place.
 */
export default function AdUnit({ className }) {
  useEffect(() => {
    // Load the AdSense library once if not already present
    if (!document.getElementById("adsbygoogle-js")) {
      const s = document.createElement("script");
      s.id = "adsbygoogle-js";
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
      s.crossOrigin = "anonymous";
      document.head.appendChild(s);
    }
    // Fill this specific ad slot only
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Library not loaded yet — harmless, ad fills on next push
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className || ""}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={AD_SLOT_ID}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}