"use client";

import chakraCustomSystem from "@/theme/chakraCustomSystem";
import { ChakraProvider } from "@chakra-ui/react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useMemo } from "react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

interface ProviderProps extends ColorModeProviderProps {
  /** Per-request nonce forwarded from middleware via x-nonce header. */
  nonce?: string;
}

export function Provider({ nonce, ...props }: ProviderProps) {
  // Create a new emotion cache on every unique nonce so injected <style> tags
  // carry the correct nonce= attribute and pass the CSP style-src check.
  const cache = useMemo(
    () =>
      createCache({
        key: "css",
        nonce,
        // prepend keeps Chakra's layer order correct
        prepend: true,
      }),
    // nonce changes per request (server renders), memoize on client per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <CacheProvider value={cache}>
      <ChakraProvider value={chakraCustomSystem}>
        <ColorModeProvider nonce={nonce} {...props} />
      </ChakraProvider>
    </CacheProvider>
  );
}
