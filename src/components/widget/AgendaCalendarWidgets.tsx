"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { DatePickerInput } from "@/components/ui/date-picker-input";
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
import { StringInput } from "@/components/ui/string-input";
import { Textarea } from "@/components/ui/textarea";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import BackButton from "@/components/widget/BackButton";
import { CreateMonevAgendaCategoryDisclosureTrigger } from "@/components/widget/CreateMonevAgendaCategoryDisclosure";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import { SelectMonevAgendaCategory } from "@/components/widget/SelectMonevAgendaCategory";
import {
  Interface__MonevAgenda,
  Interface__SelectOption,
} from "@/constants/interfaces";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray } from "@/utils/array";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { formatDate, formatTime } from "@/utils/formatter";
import { capitalize } from "@/utils/string";
import { getLocalTimezone } from "@/utils/time";
import {
  FieldRoot,
  HStack,
  Icon,
  StackProps,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconCalendar,
  IconCategory,
  IconClock,
  IconMapPin,
  IconPencilMinus,
  IconPlus,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as yup from "yup";

const BASE_ENDPOINT = "/api/monev/activity-calendar";
const PREFIX_ID = "monev_agenda_calendar";

export const CreateDisclosure = (props: any) => {
  const ID = `${PREFIX_ID}_create`;

  // Props
  const { open, initialStartedDate } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${l.add} Agenda`),
    },
    successMessage: {
      title: capitalize(`${l.add} Agenda ${l.successful}`),
    },
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

  useEffect(() => {
    if (initialStartedDate)
      formik.setFieldValue("startedDate", [initialStartedDate]);
  }, [initialStartedDate]);

  return (
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
                  disabled={!!initialStartedDate}
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
          <Btn type="submit" form={ID} colorPalette={themeConfig.colorPalette}>
            {l.add}
          </Btn>
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};
export const CreateDisclosureTrigger = (props: any) => {
  // Props
  const {
    id = `${PREFIX_ID}_create`,
    children,
    initialStartedDate,
    ...restProps
  } = props;

  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(id), open, onOpen, onClose);

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <CreateDisclosure open={open} initialStartedDate={initialStartedDate} />
    </>
  );
};
export const EditDisclosure = (props: any) => {
  const ID = `${PREFIX_ID}_edit`;

  // Props
  const { open, agenda } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`Edit Agenda`),
    },
    successMessage: {
      title: capitalize(`Edit Agenda ${l.successful}`),
    },
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
        url: `${BASE_ENDPOINT}/update/${agenda.id}`,
        method: "PATCH",
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

  useEffect(() => {
    formik.setValues({
      category: [
        {
          id: agenda?.activityCategory?.id,
          label: agenda?.activityCategory?.title,
        },
      ],
      name: agenda.name,
      description: agenda.description,
      location: agenda.location,
      startedDate: [new Date(agenda.startedDate).toISOString()],
      finishedDate: [new Date(agenda.finishedDate).toISOString()],
      startedTime: agenda.startedTime,
      finishedTime: agenda.finishedTime,
    });
  }, [agenda]);

  return (
    <DisclosureRoot open={open} lazyLoad size={"xs"}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent title={`Edit Agenda`} />
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
          <Btn type="submit" form={ID} colorPalette={themeConfig.colorPalette}>
            {l.save}
          </Btn>
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};
export const EditDisclosureTrigger = (props: any) => {
  // Props
  const { id = `${PREFIX_ID}_edit`, agenda, children, ...restProps } = props;

  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(id), open, onOpen, onClose);

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <EditDisclosure open={open} agenda={agenda} />
    </>
  );
};
export function AgendaDisclosure(props: any) {
  // Props
  const { open, date, agendas } = props;

  // Contexts
  const { l } = useLang();
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

          <CContainer gap={4}>
            {agendas?.map((agenda: Interface__MonevAgenda) => {
              return (
                <CContainer
                  key={agenda?.id}
                  rounded={themeConfig.radii.component}
                  border={"1px solid"}
                  borderColor={"border.muted"}
                >
                  <HStack align={"start"}>
                    <CContainer gap={1} p={4} py={3}>
                      <P fontWeight={"medium"}>{agenda?.name}</P>

                      <P color={"fg.muted"}>{agenda?.description}</P>
                    </CContainer>

                    <CContainer w={"fit"} p={1}>
                      <EditDisclosureTrigger
                        id={`edit-agenda-${agenda.id}`}
                        agenda={agenda}
                      >
                        <Btn iconButton size={"md"} variant={"ghost"}>
                          <Icon>
                            <IconPencilMinus stroke={1.5} />
                          </Icon>
                        </Btn>
                      </EditDisclosureTrigger>
                    </CContainer>
                  </HStack>

                  <CContainer gap={2} p={4} pb={4}>
                    <HStack color={"fg.subtle"}>
                      <Icon boxSize={5}>
                        <IconCategory stroke={1.5} />
                      </Icon>

                      <P>{agenda?.activityCategory?.title}</P>
                    </HStack>

                    <HStack color={"fg.subtle"}>
                      <Icon boxSize={5}>
                        <IconCalendar stroke={1.5} />
                      </Icon>

                      <P>{`${formatDate(agenda.startedDate, {
                        timezoneKey: getLocalTimezone().key,
                        variant: "dayShortMonthYear",
                      })} - ${formatDate(agenda.finishedDate, {
                        timezoneKey: getLocalTimezone().key,
                        variant: "dayShortMonthYear",
                      })}`}</P>
                    </HStack>

                    <HStack color={"fg.subtle"}>
                      <Icon boxSize={5}>
                        <IconClock stroke={1.5} />
                      </Icon>

                      <P>{`${formatTime(agenda.startedTime)} - ${formatTime(
                        agenda.finishedTime
                      )}`}</P>
                    </HStack>

                    <HStack color={"fg.subtle"}>
                      <Icon boxSize={5}>
                        <IconMapPin stroke={1.5} />
                      </Icon>

                      <P>{agenda?.location}</P>
                    </HStack>
                  </CContainer>
                </CContainer>
              );
            })}
          </CContainer>
        </DisclosureBody>

        <DisclosureFooter>
          <BackButton />

          <CreateDisclosureTrigger
            id={`create-agenda-${date}`}
            w={["full", null, "fit"]}
            initialStartedDate={new Date(date).toISOString()}
          >
            <Btn pl={3} size={"md"} colorPalette={themeConfig.colorPalette}>
              <Icon>
                <IconPlus stroke={1.5} />
              </Icon>

              {l.add}
            </Btn>
          </CreateDisclosureTrigger>
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
