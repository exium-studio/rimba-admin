"use client";

import { CContainer } from "@/components/ui/c-container";
import { useThemeConfig } from "@/context/useThemeConfig";
import { StackProps } from "@chakra-ui/react";

export const PageContainer = (props: StackProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <CContainer
      flex={1}
      gap={4}
      p={[2, null, 4]}
      pt={"0 !important"}
      overflow={"auto"}
      {...restProps}
    >
      {children}
    </CContainer>
  );
};

export const PageContent = (props: StackProps) => {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer
      flex={1}
      bg={"body"}
      rounded={themeConfig.radii.container}
      overflow={"auto"}
      {...restProps}
    >
      {children}
    </CContainer>
  );
};
