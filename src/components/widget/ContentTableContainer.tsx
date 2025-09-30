"use client";

import { CContainer } from "@/components/ui/c-container";
import { StackProps } from "@chakra-ui/react";

export const ContentTableContainer = (props: StackProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <CContainer
      flex={1}
      gap={4}
      p={[1, null, 4]}
      pt={"0 !important"}
      {...restProps}
    >
      {children}
    </CContainer>
  );
};
