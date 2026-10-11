import { useEffect } from "react";

// Renders a Google AdSense ad unit. The AdSense loader script is already
// included site-wide via index.html, so this component only needs to render
// the <ins> tag and push the ad slot on mount.
export default function AdSenseAd({
  slot,
  client = "ca-pub-9229056617068297",
  format = "auto",
  fullWidthResponsive = true,
  className,
}) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // AdSense not loaded yet or blocked — fail silently
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}