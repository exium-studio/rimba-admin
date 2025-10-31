"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { Divider } from "@/components/ui/divider";
import { Field } from "@/components/ui/field";
import { MenuItem } from "@/components/ui/menu";
import { NumInput } from "@/components/ui/number-input";
import { P } from "@/components/ui/p";
import { PeriodPickerInput } from "@/components/ui/period-picker-input";
import SearchInput from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { StringInput } from "@/components/ui/string-input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import BackButton from "@/components/widget/BackButton";
import { ClampText } from "@/components/widget/ClampText";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { CreateMonevPICDivisionDisclosureTrigger } from "@/components/widget/CreateMonevPICDivisionDisclosure";
import { DataDisplayToggle } from "@/components/widget/DataDisplayToggle";
import { DataGrid } from "@/components/widget/DataGrid";
import { DataGridItem } from "@/components/widget/DataGridItem";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { SelectMonevPackageContractType } from "@/components/widget/SelectMonevPackageContractType";
import { SelectMonevPICDivision } from "@/components/widget/SelectMonevPICDivision";
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import {
  Interface__BatchOptionsTableOptionGenerator,
  Interface__DataProps,
  Interface__MonevPackageInformation,
  Interface__MonevRealization,
  Interface__MonevTargets,
  Interface__RowOptionsTableOptionGenerator,
  Interface__SelectOption,
} from "@/constants/interfaces";
import { L_MONTHS } from "@/constants/months";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/sizes";
import { useDataDisplay } from "@/context/useDataDisplay";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useDataState from "@/hooks/useDataState";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray, last } from "@/utils/array";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { formatDate, formatNumber } from "@/utils/formatter";
import { capitalize, capitalizeWords, pluckString } from "@/utils/string";
import { getActiveNavs } from "@/utils/url";
import {
  Alert,
  FieldRoot,
  FieldsetRoot,
  HStack,
  Icon,
  InputGroup,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconAlertTriangle,
  IconInfoCircle,
  IconPencilMinus,
  IconPlus,
  IconTargetArrow,
  IconTimeline,
  IconTrash,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";

const BASE_ENDPOINT = "/api/monev/activity-package";
const PREFIX_ID = "monev_package_information";
type Interface__Data = Interface__MonevPackageInformation;

const MenuTooltip = (props: TooltipProps) => {
  // Props
  const { children, content, ...restProps } = props;
  return (
    <Tooltip
      content={content}
      positioning={{ placement: "right" }}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};

const Create = (props: any) => {
  const ID = `${PREFIX_ID}_create`;

  // Props
  const { routeTitle } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const iss = useIsSmScreenWidth();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(`${ID}`), open, onOpen, onClose);
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${l.add} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${l.add} ${routeTitle} ${l.successful}`),
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      picDivision: null as Interface__SelectOption[] | null,
      contractType: null as Interface__SelectOption[] | null,
      mak: "",
      name: "",
      description: "",
      startPeriod: null as any,
      endPeriod: null as any,
      unitOutput: "",
      codeOutput: "",
      volume: "",
      pagu: null as number | null,
      partner: "",
    },
    validationSchema: yup.object().shape({
      picDivision: yup.array().required(l.msg_required_form),
      contractType: yup.array().required(l.msg_required_form),
      mak: yup.string().required(l.msg_required_form),
      name: yup.string().required(l.msg_required_form),
      description: yup.string().required(l.msg_required_form),
      startPeriod: yup.object().required(l.msg_required_form),
      endPeriod: yup.object().required(l.msg_required_form),
      unitOutput: yup.string().required(l.msg_required_form),
      codeOutput: yup.string().required(l.msg_required_form),
      volume: yup.string().required(l.msg_required_form),
      pagu: yup.number().required(l.msg_required_form),
      partner: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      back();

      const payload = {
        picDivisionId: values.picDivision?.[0]?.id,
        contractType: values.contractType?.[0]?.id,
        mak: values.mak,
        name: values.name,
        description: values.description,
        startedMonth: values.startPeriod.month,
        startedYear: values.startPeriod.year,
        finishedMonth: values.endPeriod.month,
        finishedYear: values.endPeriod.year,
        unitOutput: values.unitOutput,
        codeOutput: values.codeOutput,
        volume: values.volume,
        pagu: values.pagu,
        partner: values.partner,
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
            resetForm();
            setRt((ps) => !ps);
          },
        },
      });
    },
  });

  return (
    <>
      <Tooltip content={`${l.add} data`}>
        <Btn
          iconButton={iss ? true : false}
          size={"md"}
          pl={iss ? "" : 3}
          colorPalette={themeConfig.colorPalette}
          onClick={onOpen}
        >
          <Icon>
            <IconPlus stroke={1.5} />
          </Icon>

          {!iss && l.add}
        </Btn>
      </Tooltip>

      <DisclosureRoot sclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${l.add} ${routeTitle}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <Alert.Root status="warning" mb={4}>
              <Alert.Indicator />
              <Alert.Title>
                {
                  l.alert_create_package_period_cannot_be_updated_later
                    .description
                }
              </Alert.Title>
            </Alert.Root>

            <form id={ID} onSubmit={formik.handleSubmit}>
              <FieldsetRoot disabled={loading}>
                <Field
                  label={l.settings_navs.master_data.pic_division}
                  invalid={!!formik.errors.picDivision}
                  errorText={formik.errors.picDivision as string}
                >
                  <HStack w={"full"}>
                    <SelectMonevPICDivision
                      inputValue={formik.values.picDivision}
                      onConfirm={(inputValue) => {
                        formik.setFieldValue("picDivision", inputValue);
                      }}
                      flex={1}
                    />

                    <CreateMonevPICDivisionDisclosureTrigger>
                      <Btn iconButton variant={"outline"}>
                        <Icon>
                          <IconPlus stroke={1.5} />
                        </Icon>
                      </Btn>
                    </CreateMonevPICDivisionDisclosureTrigger>
                  </HStack>
                </Field>

                <Field
                  label={l.contract_type}
                  invalid={!!formik.errors.contractType}
                  errorText={formik.errors.contractType as string}
                >
                  <SelectMonevPackageContractType
                    inputValue={formik.values.contractType}
                    onConfirm={(inputValue) => {
                      formik.setFieldValue("contractType", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.mak}
                  invalid={!!formik.errors.mak}
                  errorText={formik.errors.mak as string}
                >
                  <StringInput
                    inputValue={formik.values.mak}
                    onChange={(inputValue) => {
                      formik.setFieldValue("mak", inputValue);
                    }}
                  />
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
                  label={l.start_period}
                  invalid={!!formik.errors.startPeriod}
                  errorText={formik.errors.startPeriod as string}
                >
                  <PeriodPickerInput
                    id="start-period"
                    inputValue={formik.values.startPeriod}
                    onConfirm={(inputValue) => {
                      formik.setFieldValue("startPeriod", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.end_period}
                  invalid={!!formik.errors.endPeriod}
                  errorText={formik.errors.endPeriod as string}
                >
                  <PeriodPickerInput
                    id="end-period"
                    inputValue={formik.values.endPeriod}
                    onConfirm={(inputValue) => {
                      formik.setFieldValue("endPeriod", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.unit_output}
                  invalid={!!formik.errors.unitOutput}
                  errorText={formik.errors.unitOutput as string}
                >
                  <StringInput
                    inputValue={formik.values.unitOutput}
                    onChange={(inputValue) => {
                      formik.setFieldValue("unitOutput", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.code_output}
                  invalid={!!formik.errors.codeOutput}
                  errorText={formik.errors.codeOutput as string}
                >
                  <StringInput
                    inputValue={formik.values.codeOutput}
                    onChange={(inputValue) => {
                      formik.setFieldValue("codeOutput", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={"Volume"}
                  invalid={!!formik.errors.volume}
                  errorText={formik.errors.volume as string}
                >
                  <StringInput
                    inputValue={formik.values.volume}
                    onChange={(inputValue) => {
                      formik.setFieldValue("volume", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.pagu}
                  invalid={!!formik.errors.pagu}
                  errorText={formik.errors.pagu as string}
                >
                  <NumInput
                    inputValue={formik.values.pagu}
                    onChange={(inputValue) => {
                      formik.setFieldValue("pagu", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.partner}
                  invalid={!!formik.errors.partner}
                  errorText={formik.errors.partner as string}
                >
                  <StringInput
                    inputValue={formik.values.partner}
                    onChange={(inputValue) => {
                      formik.setFieldValue("partner", inputValue);
                    }}
                  />
                </Field>
              </FieldsetRoot>
            </form>
          </DisclosureBody>

          <DisclosureFooter>
            <Btn
              type="submit"
              form={ID}
              colorPalette={themeConfig.colorPalette}
              loading={loading}
            >
              {l.add}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
const DataUtils = (props: any) => {
  // Props
  const { filter, setFilter, routeTitle, ...restProps } = props;

  return (
    <HStack p={3} {...restProps}>
      <SearchInput
        inputValue={filter.search}
        onChange={(inputValue) => {
          setFilter({ ...filter, search: inputValue });
        }}
      />

      <DataDisplayToggle navKey={PREFIX_ID} />

      <Create routeTitle={routeTitle} />
    </HStack>
  );
};

const TargetInputItem = (props: any) => {
  // Props
  const { target, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: "update-target",
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      budgetTarget: null as number | null,
      physicalTarget: null as number | null,
      description: "",
    },
    validationSchema: yup.object().shape({
      budgetTarget: yup.number().required(l.msg_required_form),
      physicalTarget: yup.number().required(l.msg_required_form),
      description: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      const payload = values;
      const config = {
        url: `/api/monev/target/update/${target.id}`,
        method: "PATCH",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            setRt((ps) => !ps);
          },
        },
      });
    },
  });
  const isChanged = useMemo(() => {
    return (
      target &&
      (target.budgetTarget !== formik.values.budgetTarget ||
        target.physicalTarget !== formik.values.physicalTarget ||
        target.description !== formik.values.description)
    );
  }, [formik.values, target]);

  useEffect(() => {
    formik.setValues({
      budgetTarget: target.budgetTarget,
      physicalTarget: target.physicalTarget,
      description: target.description,
    });
  }, [target]);

  return (
    <CContainer
      gap={4}
      p={4}
      border={"1px solid"}
      borderColor={"border.muted"}
      rounded={themeConfig.radii.component}
      {...restProps}
    >
      <HStack justify={"space-between"}>
        <P fontWeight={"medium"}>{`${
          L_MONTHS[target.month] || "Month is not 0 based"
        }`}</P>

        <P fontWeight={"medium"} color={"fg.subtle"}>{`${target.year}`}</P>
      </HStack>

      <CContainer>
        <form id={`target-${target.id}`} onSubmit={formik.handleSubmit}>
          <FieldRoot gap={4} disabled={loading}>
            <Field
              invalid={!!formik.errors.budgetTarget}
              errorText={formik.errors.budgetTarget as string}
            >
              <P color={"fg.muted"}>{l.budget_target}</P>

              <InputGroup startAddon="Rp">
                <NumInput
                  inputValue={formik.values.budgetTarget}
                  onChange={(inputValue) => {
                    formik.setFieldValue("budgetTarget", inputValue);
                  }}
                  placeholder="xxx.xxx.xxx"
                  roundedTopLeft={0}
                  roundedBottomLeft={0}
                />
              </InputGroup>
            </Field>

            <Field
              invalid={!!formik.errors.physicalTarget}
              errorText={formik.errors.physicalTarget as string}
            >
              <P color={"fg.muted"}>{l.physical_target}</P>

              <InputGroup endAddon="%">
                <NumInput
                  inputValue={formik.values.physicalTarget}
                  onChange={(inputValue) => {
                    formik.setFieldValue("physicalTarget", inputValue);
                  }}
                  max={100}
                  roundedTopRight={0}
                  roundedBottomRight={0}
                  placeholder="xxx"
                />
              </InputGroup>
            </Field>

            <Field
              invalid={!!formik.errors.description}
              errorText={formik.errors.description as string}
            >
              <P color={"fg.muted"}>{l.description}</P>

              <Textarea
                inputValue={formik.values.description}
                onChange={(inputValue) => {
                  formik.setFieldValue("description", inputValue);
                }}
              />
            </Field>
          </FieldRoot>

          <HStack>
            <Btn
              type="submit"
              w={"fit"}
              ml={"auto"}
              mt={4}
              colorPalette={themeConfig.colorPalette}
              variant={"outline"}
              disabled={
                !isChanged ||
                !formik.values.budgetTarget ||
                !formik.values.physicalTarget ||
                !formik.values.description
              }
              loading={loading}
            >
              {l.save}
            </Btn>
          </HStack>
        </form>
      </CContainer>
    </CContainer>
  );
};
const TargetDisclosure = (props: any) => {
  // Props
  const { open, data } = props;

  // States
  const {
    error,
    initialLoading,
    data: targetData,
    onRetry,
  } = useDataState<Interface__MonevTargets>({
    initialData: undefined,
    url: `/api/monev/target/${data.id}`,
    conditions: open,
    dependencies: [open],
    dataResource: false,
    withLoadingBar: false,
  });
  const render = {
    loading: <Skeleton flex={1} minH={MIN_H_FEEDBACK_CONTAINER} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    loaded: (
      <CContainer gap={4}>
        <SimpleGrid columns={[1, null, 2]} gap={4}>
          {targetData?.monevTargetOriginal.map((target) => {
            return <TargetInputItem key={target.id} target={target} />;
          })}
        </SimpleGrid>
      </CContainer>
    ),
  };

  return (
    <DisclosureRoot open={open} lazyLoad size={"lg"}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent title={`Edit Target`} />
        </DisclosureHeader>

        <DisclosureBody>
          {initialLoading && render.loading}
          {!initialLoading && (
            <>
              {error && render.error}
              {!error && (
                <>
                  {targetData && render.loaded}
                  {(!targetData ||
                    isEmptyArray(targetData?.monevTargetOriginal)) &&
                    render.empty}
                </>
              )}
            </>
          )}
        </DisclosureBody>

        <DisclosureFooter>
          <BackButton />
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};
const TargetDisclosureTrigger = (props: any) => {
  // Props
  const { id, data, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    disclosureId(id || `${PREFIX_ID}-target-${data?.id}`),
    open,
    onOpen,
    onClose
  );

  return (
    <>
      <CContainer onClick={onOpen} {...restProps}></CContainer>

      <TargetDisclosure open={open} data={data} />
    </>
  );
};
const RealizationInputItem = (props: any) => {
  // Props
  const { realization, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: "update-realization",
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      budgetTarget: null as number | null,
      physicalTarget: null as number | null,
      description: "",
    },
    validationSchema: yup.object().shape({
      budgetTarget: yup.number().required(l.msg_required_form),
      physicalTarget: yup.number().required(l.msg_required_form),
      description: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      const payload = values;
      const config = {
        url: `/api/monev/monthly-realization/update/${realization.id}`,
        method: "PATCH",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            setRt((ps) => !ps);
          },
        },
      });
    },
  });

  useEffect(() => {
    formik.setValues({
      budgetTarget: realization.budgetTarget,
      physicalTarget: realization.physicalTarget,
      description: realization.description,
    });
  }, [realization]);

  return (
    <CContainer gap={2} {...restProps}>
      <P fontWeight={"medium"}>{`${
        L_MONTHS[realization.month] || "Month is not 0 based"
      } ${realization.year}`}</P>

      <CContainer
        p={4}
        border={"1px solid"}
        borderColor={"border.muted"}
        rounded={themeConfig.radii.component}
      >
        <form id={`target-${realization.id}`} onSubmit={formik.handleSubmit}>
          <FieldRoot gap={4} disabled={loading}></FieldRoot>
        </form>
      </CContainer>
    </CContainer>
  );
};
const RealizationList = (props: any) => {
  // Props
  const { data, ...restProps } = props;

  // States
  const monthlyRealization = data?.monthlyRealization;

  return (
    <SimpleGrid columns={[2, 3, 5]} gap={4} {...restProps}>
      {monthlyRealization?.monevMonthlyRealizationOriginal?.map(
        (realization: Interface__MonevRealization) => {
          return (
            <RealizationInputItem
              key={realization?.id}
              realization={realization}
            />
          );
        }
      )}
    </SimpleGrid>
  );
};
const RealizationDisclosure = (props: any) => {
  // Props
  const { open, data } = props;

  return (
    <DisclosureRoot open={open} lazyLoad size={"lg"}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent title={`Edit Target`} />
        </DisclosureHeader>

        <DisclosureBody>
          <RealizationList data={data} />
        </DisclosureBody>

        <DisclosureFooter>
          <BackButton />
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};
const RealizationDisclosureTrigger = (props: any) => {
  // Props
  const { data, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    disclosureId(`${PREFIX_ID}-${data?.id}`),
    open,
    onOpen,
    onClose
  );

  return (
    <>
      <CContainer onClick={onOpen} {...restProps}></CContainer>

      <RealizationDisclosure open={open} data={data} />
    </>
  );
};

const Detail = (props: any) => {
  const ID = `${PREFIX_ID}_detail`;

  // Props
  const { data } = props;
  const resolvedData = data as Interface__Data;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    disclosureId(`${ID}-${resolvedData?.id}`),
    open,
    onOpen,
    onClose
  );

  return (
    <>
      <MenuTooltip content={"Detail"}>
        <MenuItem value="detail" onClick={onOpen}>
          Detail
          <Icon boxSize={"18px"} ml={"auto"}>
            <IconInfoCircle stroke={1.5} />
          </Icon>
        </MenuItem>
      </MenuTooltip>

      <DisclosureRoot open={open} lazyLoad size={"lg"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`Detail`} />
          </DisclosureHeader>

          <DisclosureBody>
            <CContainer gap={8}>
              <CContainer gap={4}>
                <HStack justify={"space-between"}>
                  <P fontSize={"lg"} fontWeight={"semibold"}>
                    {capitalizeWords(l.activity_package_information)}
                  </P>

                  <TargetDisclosureTrigger
                    id={`target-from-detail-${resolvedData?.id}`}
                    data={resolvedData}
                    w={"fit"}
                  >
                    <Btn
                      colorPalette={themeConfig.colorPalette}
                      variant={"outline"}
                      size={"xs"}
                    >
                      Target
                    </Btn>
                  </TargetDisclosureTrigger>
                </HStack>

                <CContainer gap={2}>
                  <HStack align={"start"} gap={4}>
                    <P flex={1} flexShrink={0} color={"fg.muted"}>
                      {l.mak}
                    </P>

                    <P flex={[1, null, 2]}>{`${data?.mak}`}</P>
                  </HStack>

                  <HStack align={"start"} gap={4}>
                    <P flex={1} flexShrink={0} color={"fg.muted"}>
                      {l.unit_output}
                    </P>

                    <P flex={[1, null, 2]}>{`${data?.unitOutput}`}</P>
                  </HStack>

                  <HStack align={"start"} gap={4}>
                    <P flex={1} flexShrink={0} color={"fg.muted"}>
                      {l.code_output}
                    </P>

                    <P flex={[1, null, 2]}>{`${data?.codeOutput}`}</P>
                  </HStack>

                  <HStack align={"start"} gap={4}>
                    <P flex={1} flexShrink={0} color={"fg.muted"}>
                      {"Volume"}
                    </P>

                    <P flex={[1, null, 2]}>{`${data?.volume}`}</P>
                  </HStack>

                  <HStack align={"start"} gap={4}>
                    <P flex={1} flexShrink={0} color={"fg.muted"}>
                      {l.pic_division}
                    </P>

                    <P flex={[1, null, 2]}>{`${data?.picDivision?.title}`}</P>
                  </HStack>

                  <HStack align={"start"} gap={4}>
                    <P flex={1} flexShrink={0} color={"fg.muted"}>
                      {l.partner}
                    </P>

                    <P flex={[1, null, 2]}>{`${data?.partner}`}</P>
                  </HStack>
                </CContainer>
              </CContainer>

              <CContainer gap={4}>
                <HStack justify={"space-between"} h={"32px"}>
                  <P fontSize={"lg"} fontWeight={"semibold"}>
                    {capitalizeWords(l.input_monthly_realization)}
                  </P>
                </HStack>

                <CContainer>
                  <RealizationList data={data} />
                </CContainer>
              </CContainer>
            </CContainer>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
const Target = (props: any) => {
  const ID = `${PREFIX_ID}_target`;

  // Props
  const { data } = props;
  const resolvedData = data as Interface__Data;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    disclosureId(`${ID}-${resolvedData?.id}`),
    open,
    onOpen,
    onClose
  );

  return (
    <TargetDisclosureTrigger data={resolvedData}>
      <MenuTooltip content={"Edit Target"}>
        <MenuItem value="edit target" onClick={onOpen}>
          Target
          <Icon boxSize={"18px"} ml={"auto"}>
            <IconTargetArrow stroke={1.5} />
          </Icon>
        </MenuItem>
      </MenuTooltip>
    </TargetDisclosureTrigger>
  );
};
const Realization = (props: any) => {
  const ID = `${PREFIX_ID}_target`;

  // Props
  const { data } = props;
  const resolvedData = data as Interface__Data;

  // Contexts
  const { l } = useLang();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    disclosureId(`${ID}-${resolvedData?.id}`),
    open,
    onOpen,
    onClose
  );

  return (
    <RealizationDisclosureTrigger data={resolvedData}>
      <MenuTooltip content={l.realization}>
        <MenuItem value="realization" onClick={onOpen}>
          {l.realization}
          <Icon boxSize={"18px"} ml={"auto"}>
            <IconTimeline stroke={1.5} />
          </Icon>
        </MenuItem>
      </MenuTooltip>
    </RealizationDisclosureTrigger>
  );
};
const Update = (props: any) => {
  const ID = `${PREFIX_ID}_update`;

  // Props
  const { data, routeTitle } = props;
  const resolvedData = data as Interface__Data;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    disclosureId(`${ID}-${resolvedData?.id}`),
    open,
    onOpen,
    onClose
  );
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`Edit ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`Edit ${routeTitle} ${l.successful}`),
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      picDivision: null as Interface__SelectOption[] | null,
      contractType: null as Interface__SelectOption[] | null,
      mak: "",
      name: "",
      description: "",
      startPeriod: null as any,
      endPeriod: null as any,
      unitOutput: "",
      codeOutput: "",
      volume: "",
      pagu: null as number | null,
      partner: "",
    },
    validationSchema: yup.object().shape({
      picDivision: yup.array().required(l.msg_required_form),
      contractType: yup.array().required(l.msg_required_form),
      mak: yup.string().required(l.msg_required_form),
      name: yup.string().required(l.msg_required_form),
      description: yup.string().required(l.msg_required_form),
      startPeriod: yup.object().required(l.msg_required_form),
      endPeriod: yup.object().required(l.msg_required_form),
      unitOutput: yup.string().required(l.msg_required_form),
      codeOutput: yup.string().required(l.msg_required_form),
      volume: yup.string().required(l.msg_required_form),
      pagu: yup.number().required(l.msg_required_form),
      partner: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      back();

      const payload = {
        picDivisionId: values.picDivision?.[0]?.id,
        contractType: values.contractType?.[0]?.id,
        mak: values.mak,
        name: values.name,
        description: values.description,
        startedMonth: values.startPeriod.month,
        startedYear: values.startPeriod.year,
        finishedMonth: values.endPeriod.month,
        finishedYear: values.endPeriod.year,
        unitOutput: values.unitOutput,
        codeOutput: values.codeOutput,
        volume: values.volume,
        pagu: values.pagu,
        partner: values.partner,
      };

      const config = {
        url: `${BASE_ENDPOINT}/update/${resolvedData.id}`,
        method: "PATCH",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            resetForm();
            setRt((ps) => !ps);
          },
        },
      });
    },
  });

  useEffect(() => {
    formik.setValues({
      picDivision: [
        {
          id: resolvedData.picDivision.id,
          label: resolvedData.picDivision.title,
        },
      ],
      contractType: [
        {
          id: resolvedData.contractType,
          label: resolvedData.contractType,
        },
      ],
      mak: resolvedData.mak,
      name: resolvedData.name,
      description: resolvedData.description,
      startPeriod: {
        month: resolvedData.startedMonth,
        year: resolvedData.startedYear,
      },
      endPeriod: {
        month: resolvedData.finishedMonth,
        year: resolvedData.finishedYear,
      },
      unitOutput: resolvedData.unitOutput,
      codeOutput: resolvedData.codeOutput,
      volume: resolvedData.volume,
      pagu: resolvedData.pagu,
      partner: resolvedData.partner,
    });
  }, [open, resolvedData]);

  return (
    <>
      <Divider my={1} />

      <MenuTooltip content={"Edit"}>
        <MenuItem value="edit" onClick={onOpen}>
          Edit
          <Icon boxSize={"18px"} ml={"auto"}>
            <IconPencilMinus stroke={1.5} />
          </Icon>
        </MenuItem>
      </MenuTooltip>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`Edit ${routeTitle}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <form id={ID} onSubmit={formik.handleSubmit}>
              <FieldsetRoot disabled={loading}>
                <Field
                  label={l.settings_navs.master_data.pic_division}
                  invalid={!!formik.errors.picDivision}
                  errorText={formik.errors.picDivision as string}
                >
                  <SelectMonevPICDivision
                    inputValue={formik.values.picDivision}
                    onConfirm={(inputValue) => {
                      formik.setFieldValue("picDivision", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.contract_type}
                  invalid={!!formik.errors.contractType}
                  errorText={formik.errors.contractType as string}
                >
                  <SelectMonevPackageContractType
                    inputValue={formik.values.contractType}
                    onConfirm={(inputValue) => {
                      formik.setFieldValue("contractType", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.mak}
                  invalid={!!formik.errors.mak}
                  errorText={formik.errors.mak as string}
                >
                  <StringInput
                    inputValue={formik.values.mak}
                    onChange={(inputValue) => {
                      formik.setFieldValue("mak", inputValue);
                    }}
                    maxChar={50}
                  />
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
                    maxChar={180}
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
                  label={l.start_month}
                  invalid={!!formik.errors.startPeriod}
                  errorText={formik.errors.startPeriod as string}
                >
                  <PeriodPickerInput
                    inputValue={formik.values.startPeriod}
                    onConfirm={(inputValue) => {
                      formik.setFieldValue("startPeriod", inputValue);
                    }}
                    disabled
                  />
                </Field>

                <Field
                  label={l.end_month}
                  invalid={!!formik.errors.endPeriod}
                  errorText={formik.errors.endPeriod as string}
                >
                  <PeriodPickerInput
                    inputValue={formik.values.endPeriod}
                    onConfirm={(inputValue) => {
                      formik.setFieldValue("endPeriod", inputValue);
                    }}
                    disabled
                  />
                </Field>

                <Field
                  label={l.unit_output}
                  invalid={!!formik.errors.unitOutput}
                  errorText={formik.errors.unitOutput as string}
                >
                  <StringInput
                    inputValue={formik.values.unitOutput}
                    onChange={(inputValue) => {
                      formik.setFieldValue("unitOutput", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.code_output}
                  invalid={!!formik.errors.codeOutput}
                  errorText={formik.errors.codeOutput as string}
                >
                  <StringInput
                    inputValue={formik.values.codeOutput}
                    onChange={(inputValue) => {
                      formik.setFieldValue("codeOutput", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={"Volume"}
                  invalid={!!formik.errors.volume}
                  errorText={formik.errors.volume as string}
                >
                  <StringInput
                    inputValue={formik.values.volume}
                    onChange={(inputValue) => {
                      formik.setFieldValue("volume", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.pagu}
                  invalid={!!formik.errors.pagu}
                  errorText={formik.errors.pagu as string}
                >
                  <NumInput
                    inputValue={formik.values.pagu}
                    onChange={(inputValue) => {
                      formik.setFieldValue("pagu", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.partner}
                  invalid={!!formik.errors.partner}
                  errorText={formik.errors.partner as string}
                >
                  <StringInput
                    inputValue={formik.values.partner}
                    onChange={(inputValue) => {
                      formik.setFieldValue("partner", inputValue);
                    }}
                  />
                </Field>
              </FieldsetRoot>
            </form>
          </DisclosureBody>

          <DisclosureFooter>
            <Btn
              type="submit"
              form={ID}
              colorPalette={themeConfig.colorPalette}
              loading={loading}
            >
              {l.save}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
const Delete = (props: any) => {
  const ID = `${PREFIX_ID}_delete`;

  // Props
  const { deleteIds, clearSelectedRows, disabled, routeTitle } = props;

  // Contexts
  const { l } = useLang();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${l.delete_} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${l.delete_} ${routeTitle} ${l.successful}`),
    },
  });

  // Utils
  function onDelete() {
    back();
    req({
      config: {
        url: `${BASE_ENDPOINT}/delete`,
        method: "DELETE",
        data: {
          deleteIds: deleteIds,
        },
      },
      onResolve: {
        onSuccess: () => {
          setRt((ps) => !ps);
          clearSelectedRows?.();
        },
      },
    });
  }

  return (
    <ConfirmationDisclosureTrigger
      w={"full"}
      id={`${ID}-${deleteIds}`}
      title={`${capitalizeWords(l.perma_delete)} ${routeTitle}`}
      description={l.msg_cannot_be_undone}
      confirmLabel={
        <>
          <Icon>
            <IconAlertTriangle stroke={1.5} />
          </Icon>

          {`${l.perma_delete}`}
        </>
      }
      onConfirm={onDelete}
      confirmButtonProps={{
        color: "fg.error",
        colorPalette: "gray",
        variant: "outline",
      }}
      loading={loading}
      disabled={disabled}
    >
      <MenuTooltip content={l.delete_}>
        <MenuItem value="delete" color={"fg.error"} disabled={disabled}>
          {l.delete_}
          <Icon boxSize={"18px"} ml={"auto"}>
            <IconTrash stroke={1.5} />
          </Icon>
        </MenuItem>
      </MenuTooltip>
    </ConfirmationDisclosureTrigger>
  );
};

const Data = (props: any) => {
  // Props
  const { filter, routeTitle } = props;

  // Contexts
  const { l } = useLang();
  const displayMode = useDataDisplay((s) => s.getDisplay(PREFIX_ID));
  const displayTable = displayMode === "table";

  // States
  const {
    error,
    initialLoading,
    data,
    onRetry,
    limit,
    setLimit,
    page,
    setPage,
    pagination,
  } = useDataState<Interface__Data[]>({
    initialData: undefined,
    url: `${BASE_ENDPOINT}/index`,
    params: filter,
    dependencies: [filter],
  });
  const dataProps: Interface__DataProps = {
    headers: [
      {
        th: l.name,
        sortable: true,
      },
      {
        th: l.pagu,
        sortable: true,
        align: "end",
      },

      // timestamps
      {
        th: l.added,
        sortable: true,
      },
      {
        th: l.updated,
        sortable: true,
      },
    ],
    rows: data?.map((item, idx) => ({
      id: item.id,
      idx: idx,
      data: item,
      dim: !!item.deletedAt,
      columns: [
        {
          td: <ClampText>{`${item.name}`}</ClampText>,
          value: item.name,
        },
        {
          td: formatNumber(item.pagu),
          value: item.pagu,
          align: "end",
        },

        // timestamps
        {
          td: formatDate(item.createdAt, {
            variant: "numeric",
            withTime: true,
          }),
          value: item.createdAt,
          dataType: "date",
          dashEmpty: true,
        },
        {
          td: formatDate(item.updatedAt, {
            variant: "numeric",
            withTime: true,
            dashEmpty: true,
          }),
          value: item.updatedAt,
          dataType: "date",
        },
      ],
    })),
    rowOptions: [
      (row) => ({
        override: <Detail data={row.data} routeTitle={routeTitle} />,
      }),
      (row) => ({
        override: <Target data={row.data} routeTitle={routeTitle} />,
      }),
      (row) => ({
        override: <Realization data={row.data} routeTitle={routeTitle} />,
      }),
      (row) => ({
        override: <Update data={row.data} routeTitle={routeTitle} />,
      }),
      (row) => ({
        override: (
          <Delete
            deleteIds={[row.data.id]}
            disabled={!!row.data.deletedAt}
            routeTitle={routeTitle}
          />
        ),
      }),
    ] as Interface__RowOptionsTableOptionGenerator<Interface__Data>[],
    batchOptions: [
      (ids, { clearSelectedRows }) => ({
        override: (
          <Delete
            deleteIds={ids}
            clearSelectedRows={clearSelectedRows}
            disabled={
              isEmptyArray(ids) ||
              data
                ?.filter((item) => ids.includes(item.id))
                .some((item) => !!item.deletedAt)
            }
            routeTitle={routeTitle}
          />
        ),
      }),
    ] as Interface__BatchOptionsTableOptionGenerator[],
  };
  const render = {
    loading: <TableSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    loaded: displayTable ? (
      <DataTable
        headers={dataProps.headers}
        rows={dataProps.rows}
        rowOptions={dataProps.rowOptions}
        batchOptions={dataProps.batchOptions}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPage={pagination?.meta?.last_page}
      />
    ) : (
      <DataGrid
        data={data}
        dataProps={dataProps}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPage={pagination?.meta?.last_page}
        renderItem={({
          item,
          row,
          details,
          selectedRows,
          toggleRowSelection,
        }: any) => {
          const resolvedItem: Interface__Data = item;

          return (
            <DataGridItem
              key={resolvedItem.id}
              item={{
                id: resolvedItem.id,
                title: resolvedItem.name,
                description: resolvedItem.description,
                deletedAt: resolvedItem.deletedAt,
              }}
              dataProps={dataProps}
              row={row}
              selectedRows={selectedRows}
              toggleRowSelection={toggleRowSelection}
              routeTitle={routeTitle}
              details={details}
            />
          );
        }}
      />
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

  // States
  const pathname = usePathname();
  const activeNav = getActiveNavs(pathname);
  const routeTitle = pluckString(l, last(activeNav)!.labelKey);
  const DEFAULT_FILTER = {
    search: "",
  };
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  return (
    <PageContainer>
      <PageContent>
        <DataUtils
          filter={filter}
          setFilter={setFilter}
          routeTitle={routeTitle}
        />
        <Data filter={filter} routeTitle={routeTitle} />
      </PageContent>
    </PageContainer>
  );
}
