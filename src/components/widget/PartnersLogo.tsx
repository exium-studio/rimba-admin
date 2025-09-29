"use client";

import { Img } from "@/components/ui/img";
import { IMAGES_PATH } from "@/constants/paths";
import { HStack, StackProps } from "@chakra-ui/react";

export const PartnersLogo = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  return (
    <HStack {...restProps}>
      <Img
        src={`${IMAGES_PATH}/atrbpn-logo.png`}
        alt="ATR BPN Logo"
        w={"auto"}
        h={restProps?.h || "30px"}
        aspectRatio={1}
        objectFit="contain"
      />
      <Img
        src={`${IMAGES_PATH}/unep-logo.png`}
        alt="UNEP Logo"
        w={"auto"}
        h={restProps?.h || "30px"}
        aspectRatio={1}
        objectFit="contain"
        ml={"6px"}
      />
      <Img
        src={`${IMAGES_PATH}/gef-logo.png`}
        alt="gef Logo"
        w={"auto"}
        h={restProps?.h || "30px"}
        aspectRatio={1}
        objectFit="contain"
      />
    </HStack>
  );
};
