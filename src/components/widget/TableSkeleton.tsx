"use client";

import { CContainer } from "@/components/ui/c-container";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Skeleton, StackProps } from "@chakra-ui/react";

export const TableSkeleton = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer p={4} pt={2} flex={1} {...restProps}>
      <Skeleton flex={1} rounded={themeConfig.radii.container} />
    </CContainer>
  );
};
