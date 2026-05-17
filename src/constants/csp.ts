import type { RemotePattern } from "next/dist/shared/lib/image-config";

export const IMAGE_REMOTE_PATTERNS: RemotePattern[] = [
  {
    protocol: "https",
    hostname: "rimba.webgis.app",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "doc.rimbaexium.org",
    pathname: "/storage/documents/**",
  },
  {
    protocol: "https",
    hostname: "doc-rimba.exium.my.id",
    pathname: "/storage/documents/**",
  },
];

/**
 * RIMBA website / GIS frontend domains.
 * rimba.webgis.app is embedded as an <iframe> in the static-content page
 * (CMSAuthToken preview). All subdomains are included for API + storage.
 */
export const WEBSITE_DOMAINS = {
  /** Allowed in frame-src so the iframe embed loads. */
  frame: ["https://rimba.webgis.app", "https://*.webgis.app"],
  /** API and storage endpoints used by the admin panel itself. */
  connect: ["https://rimba.webgis.app", "https://*.webgis.app"],
  /** Images served from the website CDN / storage. */
  img: ["https://rimba.webgis.app", "https://*.webgis.app"],
} as const;

// ---------------------------------------------------------------------------
// Third-party widget domains
// ---------------------------------------------------------------------------

/**
 * Tawk.to live-chat widget.
 * Needs: script-src, connect-src (WSS), img-src, frame-src.
 * style-src requires 'unsafe-inline' — Tawk injects <style> tags at runtime
 * with no nonce support. Risk-accepted per pentest finding #4.
 */
export const TAWK_DOMAINS = {
  script: ["https://embed.tawk.to", "https://*.tawk.to"],
  connect: ["https://*.tawk.to", "wss://*.tawk.to"],
  img: ["https://*.tawk.to"],
  frame: ["https://tawk.to", "https://*.tawk.to"],
} as const;

/**
 * TinyMCE rich-text editor CDN domains (used in RichEditor.tsx).
 * Only relevant for admin paths where the editor is mounted.
 * script-src: CDN for tinymce bundle.
 * connect-src: license validation & plugin fetch.
 * img-src: editor UI icons served from CDN.
 */
export const TINYMCE_DOMAINS = {
  script: ["https://cdn.tiny.cloud"],
  connect: ["https://cdn.tiny.cloud", "https://api.tiny.cloud"],
  img: ["https://cdn.tiny.cloud", "https://sp.tinymce.com"],
} as const;
