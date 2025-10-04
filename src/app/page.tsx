"use client";

import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LangMenu } from "@/components/ui/lang-menu";
import BrandWatermark from "@/components/widget/BrandWatermark";
import { PartnersLogo } from "@/components/widget/PartnersLogo";
import SigninForm from "@/components/widget/SigninForm";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Box, Center, HStack, SimpleGrid } from "@chakra-ui/react";

export default function IndexRoute() {
  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer h={"100dvh"} align={"center"} overflowY={"auto"}>
      <SimpleGrid
        p={2}
        columns={[1, null, 2]}
        flex={1}
        w={"full"}
        overflowY={"auto"}
      >
        <CContainer
          display={["none", null, "flex"]}
          bg={themeConfig.primaryColor}
          bgPos={"center"}
          bgSize={"cover"}
          pos={"relative"}
          justify={"center"}
          overflow={"clip"}
          rounded={themeConfig.radii.container}
          maxH={"calc(100dvh - 16px)"}
        >
          <CContainer
            h={"full"}
            p={3}
            align={"start"}
            bg={"blackAlpha.300"}
            rounded={themeConfig.radii.component}
            backdropFilter={"blur(60px)"}
            pos={"absolute"}
            zIndex={10}
          >
            <Center bg={"body"} p={3} rounded={themeConfig.radii.component}>
              <PartnersLogo />
            </Center>
          </CContainer>

          <Box
            w={"120%"}
            aspectRatio={1}
            rounded={"40%"}
            bg={`${themeConfig.colorPalette}.300`}
            animation={"rotate360 5s linear infinite"}
          />
          <Box
            w={"120%"}
            aspectRatio={1}
            rounded={"40%"}
            bg={`${themeConfig.colorPalette}.600`}
            animation={"rotate360 5s linear infinite"}
          />
        </CContainer>

        <CContainer p={[2, null, 8]} gap={16} overflowY={"auto"}>
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
