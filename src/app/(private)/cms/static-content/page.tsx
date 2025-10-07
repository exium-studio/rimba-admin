"use client";

import { CContainer } from "@/components/ui/c-container";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";

export default function Page() {
  // Contexts
  const { themeConfig } = useThemeConfig();

  // Hooks
  const iss = useIsSmScreenWidth();

  // States
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "";
  const iframeUrl = `${baseUrl}?cms-token=random`;
  const p = 16;

  return (
    <CContainer flex={1} p={`${p}px`}>
      <CContainer rounded={themeConfig.radii.container} overflow={"clip"}>
        <iframe
          src={iframeUrl}
          style={{
            width: "100%",
            height: `calc(100vh - 52px - ${p * 2}px - ${
              iss ? "(29px + 78.8px)" : ""
            })`,
          }}
          title="CMS Preview"
        />
      </CContainer>
    </CContainer>
  );
}
