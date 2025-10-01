"use client";

import { P } from "@/components/ui/p";
import { TextProps } from "@chakra-ui/react";
import { useState } from "react";

export const ExpandableText = (props: TextProps) => {
  // Props
  const { children, ...restProps } = props;

  // States
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <P
      lineClamp={expanded ? undefined : 1}
      maxW={"300px"}
      whiteSpace={"normal"}
      cursor={"pointer"}
      onClick={() => setExpanded((ps) => !ps)}
      {...restProps}
    >
      {children}
    </P>
  );
};
