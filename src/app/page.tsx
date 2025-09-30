"use client";

import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LangMenu } from "@/components/ui/lang-menu";
import BrandWatermark from "@/components/widget/BrandWatermark";
import { PartnersLogo } from "@/components/widget/PartnersLogo";
import SigninForm from "@/components/widget/SigninForm";
import { IMAGES_PATH } from "@/constants/paths";
import { useThemeConfig } from "@/context/useThemeConfig";
import { HStack, SimpleGrid } from "@chakra-ui/react";

export default function IndexRoute() {
  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer minH={"100dvh"} align={"center"}>
      <SimpleGrid columns={[1, null, 2]} flex={1} w={"full"}>
        <CContainer
          display={["none", null, "flex"]}
          bg={themeConfig.primaryColor}
          bgImage={`url(${IMAGES_PATH}/hero-bg.jpg)`}
          bgPos={"center"}
          bgSize={"cover"}
        >
          <CContainer
            w={"fit"}
            p={3}
            m={4}
            bg={"body"}
            rounded={themeConfig.radii.component}
          >
            <PartnersLogo />
          </CContainer>
        </CContainer>

        <CContainer h={"full"} p={[2, null, 8]} gap={16}>
          <HStack justify={"center"}>
            <ColorModeButton />

            <LangMenu />
          </HStack>

          <SigninForm />

          <BrandWatermark textAlign={"center"} />
        </CContainer>
      </SimpleGrid>
    </CContainer>
  );
}
