"use client";

import { Img } from "@/components/ui/img";
import { APP } from "@/constants/_meta";
import { SVGS_PATH } from "@/constants/paths";
import { Center } from "@chakra-ui/react";

export const DefaultFallback = () => {
  return (
    <Center bg={"white"} w={"100w"} minH={"100dvh"} color={"fg.subtle"}>
      <Img
        alt={`${APP.name} Logo`}
        src={`${SVGS_PATH}/logo_gray.svg`}
        width={"48px"}
        height={"48px"}
        imageProps={{
          priority: true,
        }}
      />
    </Center>
  );
};
