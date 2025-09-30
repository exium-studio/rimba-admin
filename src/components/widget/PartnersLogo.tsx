"use client";

import { useEffect, useState } from "react";
import { Img } from "@/components/ui/img";
import { IMAGES_PATH } from "@/constants/paths";
import { HStack, StackProps } from "@chakra-ui/react";

interface Props extends StackProps {
  compact?: boolean;
}

const logos = [
  { src: `${IMAGES_PATH}/atrbpn-logo.png`, alt: "ATR BPN Logo" },
  { src: `${IMAGES_PATH}/unep-logo.png`, alt: "UNEP Logo" },
  { src: `${IMAGES_PATH}/gef-logo.png`, alt: "GEF Logo" },
];

export const PartnersLogo = (props: Props) => {
  const { compact, ...restProps } = props;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!compact) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % logos.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [compact]);

  if (compact) {
    const logoHeight = restProps?.h || "30px";

    return (
      <HStack
        {...restProps}
        position="relative"
        justify="center"
        align="center"
        aspectRatio={1}
        h={logoHeight}
        w="auto"
        overflow="hidden"
      >
        {logos.map((logo, i) => (
          <Img
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            w="auto"
            h={logoHeight}
            aspectRatio={1}
            objectFit="contain"
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              opacity: index === i ? 1 : 0,
              transition: "opacity 0.6s ease-in-out",
            }}
          />
        ))}
      </HStack>
    );
  }

  return (
    <HStack {...restProps}>
      {logos.map((logo, i) => (
        <Img
          key={logo.alt}
          src={logo.src}
          alt={logo.alt}
          w={"auto"}
          h={restProps?.h || "30px"}
          aspectRatio={1}
          objectFit="contain"
          ml={i === 0 ? "0" : "6px"}
        />
      ))}
    </HStack>
  );
};
