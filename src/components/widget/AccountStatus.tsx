"use client";

import useLang from "@/context/useLang";
import { Badge, BadgeProps } from "@chakra-ui/react";

interface Props extends BadgeProps {
  accountStatusId: string;
}

export const AccountStatus = (props: Props) => {
  // Props
  const { accountStatusId, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // States
  const accountStatus: Record<string, { label: string; colorPalette: string }> =
    {
      1: {
        label: l.inactive,
        colorPalette: "gray",
      },
      2: {
        label: l.active,
        colorPalette: "green",
      },
      3: {
        label: l.disabled,
        colorPalette: "red",
      },
    };

  return (
    <Badge
      colorPalette={accountStatus[accountStatusId].colorPalette}
      {...restProps}
    >
      {accountStatus[accountStatusId].label}
    </Badge>
  );
};
