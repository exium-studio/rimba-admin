"use client";

import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "";

export default function Page() {
  // Hooks
  const iss = useIsSmScreenWidth();

  // Contexts
  const authToken = useAuthMiddleware((s) => s.authToken);

  // States
  const previewURL = `${baseUrl}?authToken=${authToken}`;
  const p = 16;

  return (
    <CContainer flex={1} p={`${p}px`} overflowY={"auto"}>
      {baseUrl && (
        <iframe
          src={previewURL}
          style={{
            width: "100%",
            height: `calc(100vh - 52px - ${p * 2}px ${
              iss ? "- (29px + 78.8px)" : ""
            })`,
          }}
          title="CMS Preview"
        />
      )}
      {!baseUrl && <P m={"auto"}>Website URL not found</P>}
    </CContainer>
  );
}
