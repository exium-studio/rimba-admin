"use client";

import { CContainer } from "@/components/ui/c-container";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { P } from "@/components/ui/p";
import BackButton from "@/components/widget/BackButton";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import { Interface__MonevAgenda } from "@/constants/interfaces";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { isEmptyArray } from "@/utils/array";
import { disclosureId } from "@/utils/disclosure";
import { formatDate } from "@/utils/formatter";
import { getLocalTimezone } from "@/utils/time";
import { StackProps, useDisclosure } from "@chakra-ui/react";

export function AgendaDisclosure(props: any) {
  // Props
  const { open, date, agendas } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <DisclosureRoot open={open} lazyLoad size={"xs"}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent
            title={`Agenda ${formatDate(date, {
              timezoneKey: getLocalTimezone().key,
              variant: "dayShortMonthYear",
            })}`}
          />
        </DisclosureHeader>

        <DisclosureBody>
          {isEmptyArray(agendas) && <FeedbackNoData />}

          <CContainer gap={2}>
            {agendas?.map((agenda: Interface__MonevAgenda) => (
              <CContainer
                key={agenda?.id}
                py={2}
                px={4}
                rounded={themeConfig.radii.component}
                border={"1px solid"}
                borderColor={"border.muted"}
              >
                <P>{agenda?.name}</P>
              </CContainer>
            ))}
          </CContainer>
        </DisclosureBody>

        <DisclosureFooter>
          <BackButton />
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
}

interface AgendaDisclosureTriggerProps extends StackProps {
  id: string;
  date: string;
  agendas: Interface__MonevAgenda[];
}
export const AgendaDisclosureTrigger = (
  props: AgendaDisclosureTriggerProps
) => {
  // Props
  const { id, date, agendas, children, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(`agenda-${id}`), open, onOpen, onClose);

  return (
    <>
      <CContainer onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <AgendaDisclosure open={open} date={date} agendas={agendas} />
    </>
  );
};
