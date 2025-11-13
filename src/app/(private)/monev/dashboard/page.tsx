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
import { Field } from "@/components/ui/field";
import { FileInput } from "@/components/ui/file-input";
import { NumInput } from "@/components/ui/number-input";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { ItemHeaderContainer } from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import { PageContainer } from "@/components/widget/Page";
import { PDFViewer } from "@/components/widget/PDFViewer";
import { MONTHS } from "@/constants/months";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import useDataState from "@/hooks/useDataState";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray } from "@/utils/array";
import { getUserData } from "@/utils/auth";
import { back } from "@/utils/client";
import { hexWithOpacity } from "@/utils/color";
import { disclosureId } from "@/utils/disclosure";
import { formatNumber } from "@/utils/formatter";
import { capitalizeWords } from "@/utils/string";
import { fileValidation, min1FileExist } from "@/utils/validationSchema";
import { Chart, useChart } from "@chakra-ui/charts";
import {
  Center,
  Circle,
  FieldRoot,
  GridItem,
  HStack,
  Icon,
  SimpleGrid,
  StackProps,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconActivity,
  IconCalendarEvent,
  IconCoins,
  IconMoneybag,
  IconPencilMinus,
  IconPercentage,
  IconReceipt,
  IconTimeline,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Tooltip,
  XAxis,
} from "recharts";
import * as yup from "yup";

interface Props__StatItem extends StackProps {
  icon?: any;
  label: string;
  value: string;
  iconBg?: string;
}
const StatItem = (props: Props__StatItem) => {
  // Props
  const { icon, label, value, iconBg, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <HStack
      gap={5}
      p={4}
      bg={"body"}
      rounded={themeConfig.radii.container}
      {...restProps}
    >
      {icon && (
        <Circle
          p={3}
          bg={iconBg || `${hexWithOpacity(themeConfig.primaryColorHex, 0.075)}`}
        >
          <Icon boxSize={8} color={themeConfig.primaryColorHex}>
            {icon}
          </Icon>
        </Circle>
      )}

      <CContainer>
        <P fontSize={"xl"} fontWeight={"bold"}>
          {value}
        </P>

        <P fontWeight={"medium"} color={"fg.subtle"}>
          {label}
        </P>
      </CContainer>
    </HStack>
  );
};
interface Props__Chart extends StackProps {
  data: any;
}
const BudgetTargetLineChart = (props: Props__Chart) => {
  // Props
  const { data, ...restProps } = props;

  // Contexts
  const { l, lang } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const chart = useChart({
    data: data?.statsBudgetTarget?.map((item: any, i: number) => ({
      month: MONTHS[lang][i],
      budget: item.value,
    })),
  });

  return (
    <ItemContainer {...restProps}>
      <ItemHeaderContainer borderless>
        <ItemHeaderTitle>{l.budget_target}</ItemHeaderTitle>
      </ItemHeaderContainer>

      <Chart.Root maxH="md" chart={chart} pb={4} pr={4}>
        <LineChart data={chart.data} margin={{ left: 40, right: 40, top: 40 }}>
          <CartesianGrid
            stroke={chart.color("border")}
            strokeDasharray="3 3"
            horizontal={false}
          />
          <XAxis
            dataKey={chart.key("month")}
            tickFormatter={(value) => value.slice(0, 3)}
            stroke={chart.color("border")}
          />
          <Tooltip
            animationDuration={100}
            cursor={{ stroke: chart.color("border") }}
            content={<Chart.Tooltip hideLabel />}
          />
          <Line
            isAnimationActive={false}
            dataKey={chart.key("budget")}
            fill={chart.color(themeConfig.primaryColorHex)}
            stroke={chart.color(themeConfig.primaryColorHex)}
            strokeWidth={2}
          >
            <LabelList
              dataKey={chart.key("budget")}
              position="right"
              offset={10}
              style={{
                fontWeight: "600",
                fill: chart.color("fg"),
              }}
            />
          </Line>
        </LineChart>
      </Chart.Root>
    </ItemContainer>
  );
};
const BudgetRealizationLineChart = (props: Props__Chart) => {
  // Props
  const { data, ...restProps } = props;

  // Contexts
  const { l, lang } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const chart = useChart({
    data: data?.statsBudgetRealization?.map((item: any, i: number) => ({
      month: MONTHS[lang][i],
      budget: item.value,
    })),
  });

  return (
    <ItemContainer {...restProps}>
      <ItemHeaderContainer borderless>
        <ItemHeaderTitle>{l.budget_realization}</ItemHeaderTitle>
      </ItemHeaderContainer>

      <Chart.Root maxH="md" chart={chart} pb={4} pr={4}>
        <LineChart data={chart.data} margin={{ left: 40, right: 40, top: 40 }}>
          <CartesianGrid
            stroke={chart.color("border")}
            strokeDasharray="3 3"
            horizontal={false}
          />
          <XAxis
            dataKey={chart.key("month")}
            tickFormatter={(value) => value.slice(0, 3)}
            stroke={chart.color("border")}
          />
          <Tooltip
            animationDuration={100}
            cursor={{ stroke: chart.color("border") }}
            content={<Chart.Tooltip hideLabel />}
          />
          <Line
            isAnimationActive={false}
            dataKey={chart.key("budget")}
            fill={chart.color(themeConfig.primaryColorHex)}
            stroke={chart.color(themeConfig.primaryColorHex)}
            strokeWidth={2}
          >
            <LabelList
              dataKey={chart.key("budget")}
              position="right"
              offset={10}
              style={{
                fontWeight: "600",
                fill: chart.color("fg"),
              }}
            />
          </Line>
        </LineChart>
      </Chart.Root>
    </ItemContainer>
  );
};
const EditHibahNetworthTrigger = (props: any) => {
  // Props
  const { children, STATS_REGISTRY, dashboard, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(`edit-hibah-networth`), open, onOpen, onClose);
  const { req, loading } = useRequest({
    id: "edit-hibah-networth",
    loadingMessage: {
      title: `Edit ${STATS_REGISTRY?.networthHibah?.label.toLowerCase()}`,
    },
    successMessage: {
      title: `Edit ${STATS_REGISTRY?.networthHibah?.label.toLowerCase()} ${l.successful.toLowerCase()}`,
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      networthHibah: null as number | null,
      frameworkFiles: [] as any[],
      planFiles: [] as any[],
      deleteFrameworkFileIds: [],
      deletePlanFileIds: [],
    },
    validationSchema: yup
      .object()
      .shape({ networthHibah: yup.number().required(l.msg_required_form) }),
    onSubmit: (values) => {
      back();

      const payload = new FormData();
      payload.append("hibah", `${values.networthHibah}`);
      payload.append("description", "-");

      const config = {
        method: "PATCH",
        url: `/api/master-data/monev-dashboard/update/1`,
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
      networthHibah: dashboard?.networthHibah,
      frameworkFiles: [],
      planFiles: [],
      deleteFrameworkFileIds: [],
      deletePlanFileIds: [],
    });
  }, [dashboard]);

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={`Edit ${capitalizeWords(
                STATS_REGISTRY?.networthHibah?.label
              )}`}
            />
          </DisclosureHeader>

          <DisclosureBody>
            <form id="edit_hibah_networth" onSubmit={formik.handleSubmit}>
              <FieldRoot disabled={loading}>
                <Field
                  label={"Networth"}
                  invalid={!!formik.errors.networthHibah}
                  errorText={formik.errors.networthHibah as string}
                >
                  <NumInput
                    inputValue={formik.values.networthHibah}
                    onChange={(inputValue) => {
                      formik.setFieldValue("networthHibah", inputValue);
                    }}
                  />
                </Field>
              </FieldRoot>
            </form>
          </DisclosureBody>

          <DisclosureFooter colorPalette={themeConfig.colorPalette}>
            <Btn type="submit" form={`edit_hibah_networth`} loading={loading}>
              {l.save}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
const EditFilesTrigger = (props: any) => {
  // Props
  const { children, type, dashboard, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const isFrameworkFile = type === "framework";
  const resolvedExistingDocumentKey: "frameworkFiles" | "planFiles" =
    isFrameworkFile ? "frameworkFiles" : "planFiles";
  const resolvedDeleteDocumentIds:
    | "deleteFrameworkFileIds"
    | "deletePlanFileIds" = `${
    isFrameworkFile ? "deleteFrameworkFileIds" : "deletePlanFileIds"
  }`;
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(`edit-files`), open, onOpen, onClose);
  const { req, loading } = useRequest({
    id: "edit-files",
    loadingMessage: {
      title: `Edit ${
        isFrameworkFile
          ? l.framework_file.toLowerCase()
          : l.plan_file.toLowerCase()
      }`,
    },
    successMessage: {
      title: `Edit ${
        isFrameworkFile
          ? l.framework_file.toLowerCase()
          : l.plan_file.toLowerCase()
      } ${l.successful.toLowerCase()}`,
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      files: [] as any[],
      deleteFrameworkFileIds: [],
      deletePlanFileIds: [],
    },
    validationSchema: yup.object().shape({
      files: fileValidation({
        allowedExtensions: ["pdf"],
      }).concat(
        min1FileExist({
          resolvedData: dashboard,
          existingKey: resolvedExistingDocumentKey,
          deletedKey: resolvedDeleteDocumentIds,
          newKey: "files",
          message: l.msg_required_form,
        })
      ),
    }),
    onSubmit: (values) => {
      back();

      const payload = new FormData();
      payload.append("hibah", `${dashboard?.networthHibah}`);
      payload.append("description", "-");
      if (values.files?.[0]) {
        for (const file of values.files) {
          payload.append(
            isFrameworkFile ? "frameworkFiles" : "planFiles",
            file
          );
        }
      }
      if (!isEmptyArray(values.deleteFrameworkFileIds)) {
        payload.append(
          "deleteFrameworkFileIds",
          JSON.stringify(values.deleteFrameworkFileIds)
        );
      }
      if (!isEmptyArray(values.deletePlanFileIds)) {
        payload.append(
          "deletePlanFileIds",
          JSON.stringify(values.deletePlanFileIds)
        );
      }

      const config = {
        method: "PATCH",
        url: `/api/master-data/monev-dashboard/update/1`,
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

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={`Edit ${capitalizeWords(
                isFrameworkFile
                  ? l.framework_file.toLowerCase()
                  : l.plan_file.toLowerCase()
              )}`}
            />
          </DisclosureHeader>

          <DisclosureBody>
            <form id="edit_files" onSubmit={formik.handleSubmit}>
              <FieldRoot disabled={loading}>
                <Field
                  label={l.document}
                  invalid={!!formik.errors.files}
                  errorText={formik.errors.files as string}
                >
                  <FileInput
                    dropzone
                    inputValue={formik.values.files}
                    onChange={(inputValue) => {
                      formik.setFieldValue("files", inputValue);
                    }}
                    accept="application/pdf"
                    acceptPlaceholder=".pdf"
                    existingFiles={dashboard?.[resolvedExistingDocumentKey]}
                    onDeleteFile={(fileData) => {
                      const current: string[] =
                        formik.values[resolvedDeleteDocumentIds] || [];

                      formik.setFieldValue(
                        resolvedDeleteDocumentIds,
                        Array.from(new Set([...current, fileData.id]))
                      );
                    }}
                    onUndoDeleteFile={(fileData) => {
                      const current: string[] =
                        formik.values[resolvedDeleteDocumentIds] || [];

                      formik.setFieldValue(
                        resolvedDeleteDocumentIds,
                        current.filter((id: string) => id !== fileData.id)
                      );
                    }}
                  />
                </Field>
              </FieldRoot>
            </form>
          </DisclosureBody>

          <DisclosureFooter colorPalette={themeConfig.colorPalette}>
            <Btn type="submit" form={`edit_files`} loading={loading}>
              {l.save}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

export default function KMISDashboardPage() {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const { width: containerWidth } = useContainerDimension(containerRef);
  const user = getUserData();
  const isSuperAdmin = user?.role?.id === "1";
  const STATS_REGISTRY = {
    networthHibah: {
      icon: <IconCoins stroke={1.5} />,
      label: "Networth hibah",
    },
    totalActivityPackages: {
      icon: <IconActivity stroke={1.5} />,
      label: l.activity_package,
    },
    sumBudgetTarget: {
      icon: <IconMoneybag stroke={1.5} />,
      label: `Total ${l.budget_target.toLowerCase()}`,
    },
    avgPhysicalTarget: {
      icon: <IconPercentage stroke={1.5} />,
      label: l.avg_physical_target,
    },
    sumBudgetRealization: {
      icon: <IconReceipt stroke={1.5} />,
      label: `Total ${l.budget_realization.toLowerCase()}`,
    },
    avgProgressRealization: {
      icon: <IconTimeline stroke={1.5} />,
      label: l.avg_progress_realization,
    },
    totalActivityCalendar: {
      icon: <IconCalendarEvent stroke={1.5} />,
      label: "Agenda",
    },
  };
  const { error, initialLoading, data, onRetry } = useDataState<any>({
    initialData: undefined,
    url: `/api/master-data/monev-dashboard/info`,
    dependencies: [],
    dataResource: false,
  });
  const render = {
    loading: <Skeleton flex={1} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    loaded: (
      <CContainer gap={4}>
        <SimpleGrid columns={[1, 2, 4]} gap={4}>
          <GridItem colSpan={2}>
            <HStack
              rounded={themeConfig.radii.component}
              bg={"body"}
              align={"start"}
            >
              <StatItem
                icon={STATS_REGISTRY.networthHibah.icon}
                label={STATS_REGISTRY.networthHibah.label}
                value={formatNumber(data?.dashboard?.networthHibah) || "-"}
              />

              {isSuperAdmin && (
                <EditHibahNetworthTrigger
                  dashboard={data?.dashboard}
                  STATS_REGISTRY={STATS_REGISTRY}
                  mt={2}
                  mr={2}
                  ml={"auto"}
                >
                  <Btn iconButton size={"xs"} variant={"ghost"}>
                    <Icon boxSize={5}>
                      <IconPencilMinus stroke={1.5} />
                    </Icon>
                  </Btn>
                </EditHibahNetworthTrigger>
              )}
            </HStack>
          </GridItem>

          <StatItem
            icon={STATS_REGISTRY.totalActivityPackages.icon}
            label={STATS_REGISTRY.totalActivityPackages.label}
            value={formatNumber(data?.totalActivityPackages) || "-"}
          />

          <StatItem
            icon={STATS_REGISTRY.totalActivityCalendar.icon}
            label={STATS_REGISTRY.totalActivityCalendar.label}
            value={formatNumber(data?.totalActivityCalendar) || "-"}
          />
        </SimpleGrid>

        <SimpleGrid columns={[1, null, 2]} gap={4}>
          <CContainer
            p={4}
            gap={4}
            bg={"body"}
            rounded={themeConfig.radii.component}
          >
            <HStack>
              {/* <Circle
                p={1}
                bg={`${hexWithOpacity(themeConfig.primaryColorHex, 0.075)}`}
                color={themeConfig.primaryColor}
              >
                <Icon boxSize={5}>
                  <IconReceipt stroke={1.5} />
                </Icon>
              </Circle> */}

              <P fontWeight={"semibold"}>{l.budget_progress}</P>
            </HStack>

            <SimpleGrid columns={2} gap={4}>
              <StatItem
                label={STATS_REGISTRY.totalActivityPackages.label}
                value={formatNumber(data?.totalActivityPackages) || "-"}
                p={1}
              />

              <StatItem
                label={STATS_REGISTRY.sumBudgetTarget.label}
                value={formatNumber(data?.sumBudgetTarget) || "-"}
                p={1}
              />
            </SimpleGrid>
          </CContainer>

          <CContainer
            p={4}
            gap={4}
            bg={"body"}
            rounded={themeConfig.radii.component}
          >
            <HStack>
              {/* <Circle
                p={1}
                bg={`${hexWithOpacity(themeConfig.primaryColorHex, 0.075)}`}
                color={themeConfig.primaryColor}
              >
                <Icon boxSize={5}>
                  <IconPercentage stroke={1.5} />
                </Icon>
              </Circle> */}

              <P fontWeight={"semibold"}>{l.physical_progress}</P>
            </HStack>

            <SimpleGrid columns={2} gap={4}>
              <StatItem
                label={STATS_REGISTRY.avgPhysicalTarget.label}
                value={`${formatNumber(data?.avgPhysicalTarget)}%` || "-"}
                p={1}
              />

              <StatItem
                label={STATS_REGISTRY.avgProgressRealization.label}
                value={`${formatNumber(data?.avgProgressRealization)}%` || "-"}
                p={1}
              />
            </SimpleGrid>
          </CContainer>
        </SimpleGrid>

        <SimpleGrid columns={[1, null, 2]} gap={4}>
          <BudgetTargetLineChart data={data} />

          <BudgetRealizationLineChart data={data} />
        </SimpleGrid>

        <SimpleGrid columns={containerWidth < 1100 ? 1 : 2} gap={4}>
          <ItemContainer>
            <ItemHeaderContainer borderless>
              <HStack w={"full"} justify={"space-between"}>
                <ItemHeaderTitle>{l.framework_file}</ItemHeaderTitle>

                {isSuperAdmin && (
                  <EditFilesTrigger
                    type={"framework"}
                    dashboard={data?.dashboard}
                  >
                    <Btn iconButton variant={"ghost"} size={"xs"}>
                      <Icon boxSize={5}>
                        <IconPencilMinus stroke={1.5} />
                      </Icon>
                    </Btn>
                  </EditFilesTrigger>
                )}
              </HStack>
            </ItemHeaderContainer>

            <CContainer maxH={containerWidth < 1100 ? "400px" : ""}>
              {isEmptyArray(data?.dashboard?.frameworkFiles) && (
                <Center aspectRatio={10 / 12} w={"full"}>
                  <FeedbackNoData />
                </Center>
              )}

              {!isEmptyArray(data?.dashboard?.frameworkFiles) && (
                <PDFViewer
                  fileUrl={data?.dashboard?.frameworkFiles[0]?.fileUrl}
                />
              )}
            </CContainer>
          </ItemContainer>

          <ItemContainer>
            <ItemHeaderContainer borderless>
              <HStack w={"full"} justify={"space-between"}>
                <ItemHeaderTitle>{l.plan_file}</ItemHeaderTitle>

                {isSuperAdmin && (
                  <EditFilesTrigger type={"plan"} dashboard={data?.dashboard}>
                    <Btn iconButton variant={"ghost"} size={"xs"}>
                      <Icon boxSize={5}>
                        <IconPencilMinus stroke={1.5} />
                      </Icon>
                    </Btn>
                  </EditFilesTrigger>
                )}
              </HStack>
            </ItemHeaderContainer>

            <CContainer maxH={containerWidth < 1100 ? "400px" : ""}>
              {isEmptyArray(data?.dashboard?.planFiles) && (
                <Center aspectRatio={10 / 12} w={"full"}>
                  <FeedbackNoData />
                </Center>
              )}

              {!isEmptyArray(data?.dashboard?.planFiles) && (
                <PDFViewer fileUrl={data?.dashboard?.planFiles[0]?.fileUrl} />
              )}
            </CContainer>
          </ItemContainer>
        </SimpleGrid>
      </CContainer>
    ),
  };

  return (
    <PageContainer ref={containerRef}>
      {initialLoading && render.loading}
      {!initialLoading && (
        <>
          {error && render.error}
          {!error && (
            <>
              {data && render.loaded}
              {!data && render.empty}
            </>
          )}
        </>
      )}
    </PageContainer>
  );
}
