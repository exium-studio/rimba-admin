import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import ClientSideOnly from "@/components/widget/ClientSideOnly";
import { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Figtree } from "next/font/google";
import { APP } from "@/constants/_meta";

interface Props {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  applicationName: APP.name,
  title: {
    default: APP.defaultTitle,
    template: APP.titleTemplate,
  },
  description: APP.description,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP.defaultTitle,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP.name,
    title: {
      default: APP.defaultTitle,
      template: APP.titleTemplate,
    },
    description: APP.description,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP.defaultTitle,
      template: APP.titleTemplate,
    },
    description: APP.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

const figtree = Figtree({
  subsets: ["latin"],
});

const RootLayout = async (props: Props) => {
  // Props
  const { children } = props;

  // Read the per-request nonce injected by middleware (via x-nonce header).
  // Next.js App Router automatically applies this nonce to its own inline
  // hydration scripts when the CSP header contains 'nonce-XXX'.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html suppressHydrationWarning className={figtree.className}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body>
        <Provider nonce={nonce}>
          <Toaster />
          {/* <Suspense fallback={<DefaultFallback />}> */}
          <ClientSideOnly>{children}</ClientSideOnly>
          {/* </Suspense> */}
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
