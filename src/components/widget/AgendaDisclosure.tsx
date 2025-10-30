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
import useBackOnClose from "@/hooks/useBackOnClose";
import { disclosureId } from "@/utils/disclosure";
import { formatDate } from "@/utils/formatter";
import { getLocalTimezone } from "@/utils/time";
import { StackProps, useDisclosure } from "@chakra-ui/react";

export function AgendaDisclosure(props: any) {
  // Props
  const { open, date } = props;

  return (
    <DisclosureRoot open={open} lazyLoad>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent title={`Agenda`} />
        </DisclosureHeader>

        <DisclosureBody>
          <P>{`${date?.fullDate}`}</P>
          <P>{`${formatDate(date?.fullDate, {
            timezoneKey: getLocalTimezone().key,
          })}`}</P>

          <FeedbackNoData />
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
  date: {
    fullDate: Date;
    date: number;
    month: number;
    year: number;
  };
}
export const AgendaDisclosureTrigger = (
  props: AgendaDisclosureTriggerProps
) => {
  // Props
  const { id, date, children, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(`agenda-${id}`), open, onOpen, onClose);

  return (
    <>
      <CContainer onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <AgendaDisclosure open={open} date={date} />
    </>
  );
};
