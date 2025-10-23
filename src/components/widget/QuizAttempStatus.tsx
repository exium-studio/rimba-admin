"use client";

import useLang from "@/context/useLang";
import { Badge, BadgeProps } from "@chakra-ui/react";

interface Props extends BadgeProps {
  quizAttempStatus?: number;
}

export const QuizAttempStatus = (props: Props) => {
  // Props
  const { quizAttempStatus, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // States
  let label = "";
  let colorPalette: BadgeProps["colorPalette"] = "gray";

  switch (quizAttempStatus) {
    case 1:
      label = l.on_progress;
      colorPalette = "orange";
      break;
    case 2:
      label = l.finished;
      colorPalette = "green";
      break;
    default:
      label = "Unknown";
      colorPalette = "gray";
      break;
  }

  return (
    <Badge fontSize={"sm"} colorPalette={colorPalette} {...restProps}>
      {label}
    </Badge>
  );
};
