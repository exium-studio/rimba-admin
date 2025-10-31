"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { DateTimePickerInput } from "@/components/ui/date-time-picker-input";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { Field } from "@/components/ui/field";
import { P } from "@/components/ui/p";
import { PeriodPickerInput } from "@/components/ui/period-picker-input";
import { StringInput } from "@/components/ui/string-input";
import { Textarea } from "@/components/ui/textarea";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { AgendaDisclosureTrigger } from "@/components/widget/AgendaDisclosure";
import {
  CreateMonevAgendaCategoryDisclosure,
  CreateMonevAgendaCategoryDisclosureTrigger,
} from "@/components/widget/CreateMonevAgendaCategoryDisclosure";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { SelectMonevAgendaCategory } from "@/components/widget/SelectMonevAgendaCategory";
import {
  Interface__MonevAgenda,
  Interface__SelectOption,
} from "@/constants/interfaces";
import { Type__Period } from "@/constants/types";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import useRequest from "@/hooks/useRequest";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import {
  FieldRoot,
  Group,
  HStack,
  Icon,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconCaretLeftFilled,
  IconCaretRightFilled,
  IconPlus,
} from "@tabler/icons-react";
import { addDays, startOfWeek } from "date-fns";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";

const BASE_ENDPOINT = "/api/monev/activity-calendar";
const PREFIX_ID = "monev_agenda_calendar";
type Interface__Data = Interface__MonevAgenda;
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

const Create = (props: BtnProps) => {
  const ID = `${PREFIX_ID}_create`;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(ID), open, onOpen, onClose);
  const { req, loading } = useRequest({
    id: ID,
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      category: null as Interface__SelectOption[] | null,
      name: "",
      description: "",
      location: "",
      startedDate: null as any,
      finishedDate: null as any,
      startedTime: "",
      finishedTime: "",
    },
    validationSchema: yup.object().shape({
      category: yup.array().required(l.msg_required_form),
      name: yup.string().required(l.msg_required_form),
      description: yup.string().required(l.msg_required_form),
      location: yup.string().required(l.msg_required_form),
      startedDate: yup.array().required(l.msg_required_form),
      finishedDate: yup.array().required(l.msg_required_form),
      startedTime: yup.string().required(l.msg_required_form),
      finishedTime: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      back();

      const payload = {
        activityCategoryId: values.category?.[0]?.id ?? null,
        name: values.name,
        description: values.description,
        location: values.location,
        startedDate: values.startedDate[0],
        finishedDate: values.finishedDate[0],
        startedTime: values.startedTime,
        finishedTime: values.finishedTime,
      };

      const config = {
        url: `${BASE_ENDPOINT}/create`,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            setRt((ps) => !ps);
            resetForm();
          },
        },
      });
    },
  });

  return (
    <>
      <Btn
        pl={3}
        size={"md"}
        colorPalette={themeConfig.colorPalette}
        onClick={onOpen}
        {...props}
      >
        <Icon>
          <IconPlus stroke={1.5} />
        </Icon>

        {l.add}
      </Btn>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${l.add} Agenda`} />
          </DisclosureHeader>

          <DisclosureBody>
            <form id={ID} onSubmit={formik.handleSubmit}>
              <FieldRoot gap={4} disabled={loading}>
                <Field
                  label={l.category}
                  invalid={!!formik.errors.category}
                  errorText={formik.errors.category as string}
                >
                  <HStack w={"full"}>
                    <SelectMonevAgendaCategory
                      inputValue={formik.values.category}
                      onConfirm={(inputValue) => {
                        formik.setFieldValue("category", inputValue);
                      }}
                      flex={1}
                    />

                    <CreateMonevAgendaCategoryDisclosureTrigger>
                      <Btn iconButton variant={"outline"}>
                        <Icon>
                          <IconPlus stroke={1.5} />
                        </Icon>
                      </Btn>
                    </CreateMonevAgendaCategoryDisclosureTrigger>
                  </HStack>
                </Field>

                <Field
                  label={l.name}
                  invalid={!!formik.errors.name}
                  errorText={formik.errors.name as string}
                >
                  <StringInput
                    inputValue={formik.values.name}
                    onChange={(inputValue) => {
                      formik.setFieldValue("name", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.description}
                  invalid={!!formik.errors.description}
                  errorText={formik.errors.description as string}
                >
                  <Textarea
                    inputValue={formik.values.description}
                    onChange={(inputValue) => {
                      formik.setFieldValue("description", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.location}
                  invalid={!!formik.errors.location}
                  errorText={formik.errors.location as string}
                >
                  <StringInput
                    inputValue={formik.values.location}
                    onChange={(inputValue) => {
                      formik.setFieldValue("location", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.start_date}
                  invalid={!!formik.errors.startedDate}
                  errorText={formik.errors.startedDate as string}
                >
                  <DatePickerInput
                    id="start-date"
                    inputValue={formik.values.startedDate}
                    onConfirm={(inputValue) => {
                      formik.setFieldValue("startedDate", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.end_date}
                  invalid={!!formik.errors.finishedDate}
                  errorText={formik.errors.finishedDate as string}
                >
                  <DatePickerInput
                    id="end-date"
                    inputValue={formik.values.finishedDate}
                    onConfirm={(inputValue) => {
                      formik.setFieldValue("finishedDate", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.start_time}
                  invalid={!!formik.errors.startedTime}
                  errorText={formik.errors.startedTime as string}
                >
                  <TimePickerInput
                    id="start-time"
                    inputValue={formik.values.startedTime}
                    onConfirm={(inputValue) => {
                      formik.setFieldValue("startedTime", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.end_time}
                  invalid={!!formik.errors.finishedTime}
                  errorText={formik.errors.finishedTime as string}
                >
                  <TimePickerInput
                    id="end-time"
                    inputValue={formik.values.finishedTime}
                    onConfirm={(inputValue) => {
                      formik.setFieldValue("finishedTime", inputValue);
                    }}
                  />
                </Field>
              </FieldRoot>
            </form>
          </DisclosureBody>

          <DisclosureFooter>
            <Btn
              type="submit"
              form={ID}
              colorPalette={themeConfig.colorPalette}
            >
              {l.add}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
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
        <HStack wrap={["wrap", null, "nowrap"]} p={4} justify={"space-between"}>
          <PeriodPicker
            period={period}
            setPeriod={setPeriod}
            zIndex={2}
            w={["full", null, "fit"]}
          />

          <Create w={["full", null, "fit"]} />
        </HStack>

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
