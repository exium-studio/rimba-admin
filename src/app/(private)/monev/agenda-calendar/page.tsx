"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { PeriodPickerInput } from "@/components/ui/period-picker-input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AgendaDisclosureTrigger,
  CreateDisclosureTrigger,
} from "@/components/widget/AgendaCalendarWidgets";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { Interface__MonevAgendaCalendar } from "@/constants/interfaces";
import { Type__Period } from "@/constants/types";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useDataState from "@/hooks/useDataState";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { isEmptyArray } from "@/utils/array";
import { getCalendarRange } from "@/utils/date";
import {
  Circle,
  Group,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import {
  IconCaretLeftFilled,
  IconCaretRightFilled,
  IconPlus,
} from "@tabler/icons-react";
import { useState } from "react";

const BASE_ENDPOINT = "/api/monev/activity-calendar";
type Interface__Data = Interface__MonevAgendaCalendar;
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

const Data = (props: any) => {
  // Props
  const { period } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const { firstVisible, lastVisible } = getCalendarRange(period);
  const { error, initialLoading, loading, data, onRetry } = useDataState<
    Interface__Data[]
  >({
    initialData: undefined,
    url: `${BASE_ENDPOINT}/index`,
    params: { startDate: firstVisible, endDate: lastVisible },
    dependencies: [period],
    dataResource: false,
  });
  const render = {
    loading: <Skeleton flex={1} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    loaded: (
      <CContainer flex={1} className="scrollY">
        <SimpleGrid
          columns={[7]}
          flex={1}
          minH={["600px", null, "700px"]}
          gridAutoRows={"1fr"}
        >
          {data?.map((cal, idx) => {
            const today = new Date();
            const date = cal.date;
            const month = Number(cal.date.split("-")[1]);
            const isDateToday = today.toISOString().split("T")[0] === cal.date;
            const isDateInThisPeriod = month - 1 === period.month;

            return (
              <AgendaDisclosureTrigger
                key={`${date}`}
                id={`${date}`}
                date={date}
                agendas={cal?.agendas}
                borderLeft={idx % 7 !== 0 ? "1px solid" : ""}
                borderTop={idx > 0 ? "1px solid" : ""}
                borderColor={"border.muted"}
                cursor={"pointer"}
                _hover={{
                  bg: "d1",
                }}
                transition={"200ms"}
                flex={1}
              >
                <Stack
                  flexDir={["column", null, "row"]}
                  align={"center"}
                  justify={"space-between"}
                  p={[2, null, 4]}
                >
                  <P
                    fontSize={["sm", null, "md"]}
                    fontWeight={isDateToday ? "extrabold" : ""}
                    opacity={loading ? 0.3 : isDateInThisPeriod ? 1 : 0.3}
                  >
                    {`${Number(date.split("-")[2])}`}
                  </P>

                  {cal?.agendas?.length > 0 && (
                    <Circle
                      p={"2px"}
                      w={"18px"}
                      h={"18px"}
                      bg={`${themeConfig.colorPalette}.subtle`}
                      color={themeConfig.primaryColor}
                    >
                      <P fontSize={["xs", null, "sm"]}>{`${
                        cal?.agendas?.length < 9 ? cal?.agendas?.length : "9+"
                      }`}</P>
                    </Circle>
                  )}
                </Stack>

                <CContainer p={1} gap={1} mt={"auto"}>
                  {cal?.agendas?.map((agenda, idx) => {
                    return (
                      idx < 2 && (
                        <CContainer
                          key={agenda?.id}
                          p={1}
                          px={2}
                          rounded={themeConfig.radii.component}
                          bg={`${themeConfig.colorPalette}.subtle`}
                        >
                          <P fontSize={["sm", null, "md"]} lineClamp={1}>
                            {agenda?.name}
                          </P>
                        </CContainer>
                      )
                    );
                  })}
                </CContainer>
              </AgendaDisclosureTrigger>
            );
          })}
        </SimpleGrid>
      </CContainer>
    ),
  };

  return (
    <>
      {initialLoading && render.loading}
      {!initialLoading && (
        <>
          {error && render.error}
          {!error && (
            <>
              {data && render.loaded}
              {(!data || isEmptyArray(data)) && render.empty}
            </>
          )}
        </>
      )}
    </>
  );
};

export default function Page() {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const iss = useIsSmScreenWidth();

  // States
  const [period, setPeriod] = useState<Type__Period>(DEFAULT_PERIOD);
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
        <HStack wrap={["wrap", null, "nowrap"]} p={4} justify={"space-between"}>
          <PeriodPicker
            period={period}
            setPeriod={setPeriod}
            zIndex={2}
            w={["full", null, "fit"]}
          />

          <CreateDisclosureTrigger w={["full", null, "fit"]}>
            <Btn pl={3} size={"md"} colorPalette={themeConfig.colorPalette}>
              <Icon>
                <IconPlus stroke={1.5} />
              </Icon>

              {l.add}
            </Btn>
          </CreateDisclosureTrigger>
        </HStack>

        <CContainer
          flex={1}
          borderTop={"1px solid"}
          borderColor={"border.muted"}
          overflow={"auto"}
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

          <Data period={period} />
        </CContainer>
      </PageContent>
    </PageContainer>
  );
}
