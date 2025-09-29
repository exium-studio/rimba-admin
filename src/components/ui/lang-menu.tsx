"use client";

import { DotIndicator } from "@/components/widget/Indicator";
import { ButtonProps, MenuPositioner, Portal } from "@chakra-ui/react";
import { IconChevronDown } from "@tabler/icons-react";
import useLang from "../../context/useLang";
import { Btn } from "./btn";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "./menu";
import { Tooltip } from "./tooltip";

interface Props extends ButtonProps {}

const LANGUAGES = [
  {
    key: "id",
    code: "id-ID",
    label: "Indonesia",
  },
  {
    key: "en",
    code: "en-US",
    label: "English",
  },
];

export const LangMenu = ({ ...props }: Props) => {
  // Contexts
  const { l, lang, setLang } = useLang();

  return (
    <Tooltip content={l.language}>
      <MenuRoot>
        <MenuTrigger asChild>
          <Btn
            clicky={false}
            px={2}
            pr={1}
            variant={"ghost"}
            color={"current"}
            size="sm"
            {...props}
          >
            {lang.toUpperCase()}
            <IconChevronDown stroke={1.5} />
          </Btn>
        </MenuTrigger>

        <Portal>
          <MenuPositioner>
            <MenuContent zIndex={2000}>
              {LANGUAGES.map((item, i) => {
                const active = item.key === lang;

                return (
                  <MenuItem
                    key={i}
                    value={item.key}
                    onClick={() => setLang(item.key as any)}
                    fontWeight={active ? "medium" : "normal"}
                  >
                    {item.label}

                    {active && <DotIndicator mr={1} />}
                  </MenuItem>
                );
              })}
            </MenuContent>
          </MenuPositioner>
        </Portal>
      </MenuRoot>
    </Tooltip>
  );
};
