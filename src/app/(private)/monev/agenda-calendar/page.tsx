"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { PeriodPickerInput } from "@/components/ui/period-picker-input";
import { AgendaDisclosureTrigger } from "@/components/widget/AgendaDisclosure";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { Type__Period } from "@/constants/types";
import useLang from "@/context/useLang";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { Group, Icon, SimpleGrid } from "@chakra-ui/react";
import { IconCaretLeftFilled, IconCaretRightFilled } from "@tabler/icons-react";
import { addDays, startOfWeek } from "date-fns";
import { useState } from "react";

const DEFAULT_PERIOD = {
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
};

const PeriodPicker = (props: any) => {
  // Props
  const { period, setPeriod, ...restProps } = props;

  // Utils
  function cycleMonth(type: "decrement" | "increment") {
    const currentMonth = period.month ?? 0;
    const currentYear = period.year ?? new Date().getFullYear();

    let newMonth = currentMonth;
    let newYear = currentYear;

    if (type === "decrement") {
      if (currentMonth === 0) {
        newMonth = 11; // Des
        newYear = currentYear - 1;
      } else {
        newMonth = currentMonth - 1;
      }
    } else {
      if (currentMonth === 11) {
        newMonth = 0; // Jan
        newYear = currentYear + 1;
      } else {
        newMonth = currentMonth + 1;
      }
    }

    setPeriod({ month: newMonth, year: newYear });
  }

  return (
    <Group {...restProps}>
      <PeriodPickerInput
        flex={1}
        size={"md"}
        justifyContent="center"
        inputValue={period}
        invalid={false}
        onConfirm={(inputValue) => {
          setPeriod(inputValue);
        }}
        required
        w={"140px"}
        // border={"none"}
      />

      <Btn
        iconButton
        clicky={false}
        variant={"outline"}
        onClick={() => cycleMonth("decrement")}
        size={"md"}
      >
        <Icon boxSize={4}>
          <IconCaretLeftFilled />
        </Icon>
      </Btn>

      <Btn
        iconButton
        clicky={false}
        variant={"outline"}
        onClick={() => cycleMonth("increment")}
        size={"md"}
      >
        <Icon boxSize={4}>
          <IconCaretRightFilled />
        </Icon>
      </Btn>
    </Group>
  );
};

export default function Page() {
  // Contexts
  const { l } = useLang();

  // Hooks
  const iss = useIsSmScreenWidth();

  // States
  const [period, setPeriod] = useState<Type__Period>(DEFAULT_PERIOD);
  const fullDates = () => {
    const firstDayOfMonth = new Date(period.year!, period.month!, 1);

    const startOfFirstWeek = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });

    const weekDates = [];
    let currentWeek = [];

    for (let i = 0; i < 6; i++) {
      currentWeek = [];

      for (let j = 0; j < 7; j++) {
        const fullDate = addDays(startOfFirstWeek, i * 7 + j);
        currentWeek.push({
          fullDate: fullDate,
          date: fullDate.getDate(),
          month: fullDate.getMonth(),
          year: fullDate.getFullYear(),
        });
      }

      weekDates.push(currentWeek);
    }

    return weekDates;
  };
  const WEEKDAYS = [
    l.monday,
    l.tuesday,
    l.wednesday,
    l.thursday,
    l.friday,
    l.saturday,
    l.sunday,
  ];

  return (
    <PageContainer>
      <PageContent>
        <CContainer p={4}>
          <PeriodPicker
            period={period}
            setPeriod={setPeriod}
            zIndex={2}
            w={"fit"}
          />
        </CContainer>

        <CContainer
          flex={1}
          borderTop={"1px solid"}
          borderColor={"border.muted"}
          // rounded={themeConfig.radii.component}
          overflow={"clip"}
        >
          <SimpleGrid
            columns={[7]}
            borderBottom={"1px solid"}
            borderColor={"border.muted"}
          >
            {WEEKDAYS.map((day, idx) => (
              <CContainer
                key={idx}
                py={1}
                px={[2, null, 4]}
                borderLeft={idx > 0 ? "1px solid" : ""}
                borderColor={"border.muted"}
              >
                <P fontSize={["sm", null, "md"]} fontWeight={"medium"}>
                  {iss ? day.slice(0, 3) : day}
                </P>
              </CContainer>
            ))}
          </SimpleGrid>

          {fullDates().map((weeks, idx) => (
            <SimpleGrid columns={[7]} key={idx} flex={1}>
              {weeks.map((date, idx2) => {
                const today = new Date();
                const dateToday =
                  date.date === today.getDate() &&
                  date.month === today.getMonth() &&
                  date.year === today.getFullYear();
                const isDataInThisMonth = date.month === period.month;

                return (
                  <AgendaDisclosureTrigger
                    key={`${date.date}-${date.month}-${date.year}`}
                    id={`${date.date}-${date.month}-${date.year}`}
                    date={date}
                  >
                    <CContainer
                      flex={1}
                      p={[2, null, 4]}
                      borderLeft={idx2 > 0 ? "1px solid" : ""}
                      borderTop={idx > 0 ? "1px solid" : ""}
                      borderColor={"border.muted"}
                      cursor={"pointer"}
                      _hover={{
                        bg: "d1",
                      }}
                      transition={"200ms"}
                    >
                      <P
                        fontSize={["sm", null, "md"]}
                        fontWeight={dateToday ? "extrabold" : ""}
                        opacity={isDataInThisMonth ? 1 : 0.3}
                      >
                        {`${date.date}`}
                      </P>
                    </CContainer>
                  </AgendaDisclosureTrigger>
                );
              })}
            </SimpleGrid>
          ))}
        </CContainer>
      </PageContent>
    </PageContainer>
  );
}
