import { useEffect } from "react";

const DEFAULT_TITLE = "MyPCOS — PCOS Symptoms, Diet & Fertility | Ask Dr. Tinc Anne";
const DEFAULT_DESCRIPTION =
  "MyPCOS is your supportive hub for PCOS knowledge and community. Ask Dr. Tinc Anne about PCOS symptoms, nutrition, fertility, insulin resistance, and more. Free to join.";

function upsertMeta(attr, key, content) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

/**
 * Sets the document title and meta tags for a page.
 * Restores defaults on unmount so navigations between pages with and
 * without <Seo> always show the right metadata.
 */
export default function Seo({ title, description }) {
  useEffect(() => {
    document.title = title || DEFAULT_TITLE;
    const desc = description || DEFAULT_DESCRIPTION;
    upsertMeta("name", "description", desc);
    upsertMeta("property", "og:title", title || "MyPCOS — PCOS Symptoms, Diet & Fertility");
    upsertMeta("property", "og:description", desc);
    return () => {
      document.title = DEFAULT_TITLE;
      upsertMeta("name", "description", DEFAULT_DESCRIPTION);
      upsertMeta("property", "og:title", "MyPCOS — PCOS Symptoms, Diet & Fertility");
      upsertMeta("property", "og:description", DEFAULT_DESCRIPTION);
    };
  }, [title, description]);
  return null;
}