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
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { NumInput } from "@/components/ui/number-input";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { DotIndicator } from "@/components/widget/Indicator";
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
  HStack,
  Icon,
  SimpleGrid,
  StackProps,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconActivity,
  IconCalendarEvent,
  IconCaretDownFilled,
  IconCoins,
  IconMoneybag,
  IconPencilMinus,
  IconPercentage,
  IconReceipt,
  IconTimeline,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as yup from "yup";

// const DUMMY_DASHBOARD_DATA = {
//   dashboard: {
//     id: "1",
//     frameworkFiles: [
//       {
//         id: "138",
//         uploadedBy: "1",
//         verifiedBy: "1",
//         fileId: "4e5517de-7b86-4797-9b45-fc5bd391faed",
//         fileName: "dummy-pdf.pdf",
//         filePath: "storage/documents/dummy-pdf.pdf",
//         fileUrl: "https://doc.rimbaexium.org/storage/documents/dummy-pdf.pdf",
//         fileMimeType: "application/pdf",
//         fileSize: "1017.73 kB",
//         createdAt: "2025-11-20T03:34:55.203Z",
//         updatedAt: "2025-11-20T03:34:55.203Z",
//         deletedAt: null,
//       },
//     ],
//     planFiles: [
//       {
//         id: "139",
//         uploadedBy: "1",
//         verifiedBy: "1",
//         fileId: "db65bfe8-6a69-4c0e-ae5b-a5103338c8fe",
//         fileName: "dummy-pdf(1).pdf",
//         filePath: "storage/documents/dummy-pdf(1).pdf",
//         fileUrl:
//           "https://doc.rimbaexium.org/storage/documents/dummy-pdf(1).pdf",
//         fileMimeType: "application/pdf",
//         fileSize: "1017.73 kB",
//         createdAt: "2025-11-20T03:35:14.471Z",
//         updatedAt: "2025-11-20T03:35:14.471Z",
//         deletedAt: null,
//       },
//     ],
//     description: "-",
//     networthHibahIDR: "97363629763",
//     networthHibahUSD: "7363629763",
//     createdAt: "2025-11-04T13:25:58.823Z",
//     updatedAt: "2025-12-16T04:12:49.543Z",
//     deletedAt: null,
//   },
//   totalActivityPackages: 2,
//   totalActivityCalendar: 8,
//   sumBudgetTarget: 2135581000,
//   sumBudgetRealization: 2135580000,
//   avgPhysicalTarget: 59,
//   avgPhysicalRealization: 35.63,
//   chartBudget: [
//     { month: 0, target: 0, realization: 0 },
//     { month: 1, target: 150000000, realization: 120000000 },
//     { month: 2, target: 220000000, realization: 180000000 },
//     { month: 3, target: 300000000, realization: 260000000 },
//     { month: 4, target: 280000000, realization: 240000000 },
//     { month: 5, target: 350000000, realization: 310000000 },
//     { month: 6, target: 400000000, realization: 360000000 },
//     { month: 7, target: 380000000, realization: 330000000 },
//     { month: 8, target: 420000000, realization: 370000000 },
//     { month: 9, target: 300000000, realization: 260000000 },
//     { month: 10, target: 250000000, realization: 200000000 },
//     { month: 11, target: 0, realization: 0 },
//   ],
//   chartPhysical: [
//     { month: 0, target: 0, realization: 0 },
//     { month: 1, target: 45, realization: 38 },
//     { month: 2, target: 52, realization: 47 },
//     { month: 3, target: 60, realization: 55 },
//     { month: 4, target: 65, realization: 58 },
//     { month: 5, target: 70, realization: 63 },
//     { month: 6, target: 75, realization: 69 },
//     { month: 7, target: 80, realization: 74 },
//     { month: 8, target: 85, realization: 78 },
//     { month: 9, target: 90, realization: 82 },
//     { month: 10, target: 95, realization: 88 },
//     { month: 11, target: 100, realization: 92 },
//   ],
// };
const DEFAULT_FILTER = {
  year: new Date().getFullYear(),
};
const YEAR_OPTIONS = Array.from(
  { length: new Date().getFullYear() - 2020 + 1 },
  (_, i) => new Date().getFullYear() - i
);

interface Props__StatItem extends StackProps {
  icon?: any;
  iconLetter?: string;
  label: string;
  value: string;
  iconBg?: string;
}
const StatItem = (props: Props__StatItem) => {
  // Props
  const { icon, iconLetter, label, value, iconBg, ...restProps } = props;

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
      {(icon || iconLetter) && (
        <Circle
          p={3}
          bg={iconBg || `${hexWithOpacity(themeConfig.primaryColorHex, 0.075)}`}
        >
          {iconLetter ? (
            <P
              fontSize={"xl"}
              fontWeight={"medium"}
              textAlign={"center"}
              m={"auto"}
            >
              {iconLetter}
            </P>
          ) : (
            <Icon boxSize={8} color={themeConfig.primaryColorHex}>
              {icon}
            </Icon>
          )}
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
  STATS_REGISTRY: any;
}
const BudgetLineChart = (props: Props__Chart) => {
  // Props
  const { data, STATS_REGISTRY, ...restProps } = props;

  // Contexts
  const { l, lang } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const chart = useChart({
    data: data?.chartBudget?.map((item: any, i: number) => ({
      months: MONTHS[lang][i],
      Target: item.target,
      Realization: item.realization,
    })),
    // series: [
    //   {
    //     name: "Target",
    //     color: themeConfig.primaryColorHex,
    //   },
    //   {
    //     name: "Realization",
    //     color: "orange.400",
    //   },
    // ],
  });

  return (
    <ItemContainer {...restProps}>
      <ItemHeaderContainer borderless>
        <ItemHeaderTitle>{`${l.budget} (${capitalizeWords(
          l.target_and_realization
        )})`}</ItemHeaderTitle>
      </ItemHeaderContainer>

      <CContainer
        p={4}
        gap={4}
        bg={"body"}
        rounded={themeConfig.radii.component}
      >
        <SimpleGrid columns={2} gap={4}>
          <StatItem
            label={STATS_REGISTRY.sumBudgetTarget.label}
            value={formatNumber(data?.sumBudgetTarget) || "-"}
            p={1}
          />

          <StatItem
            label={STATS_REGISTRY.sumBudgetRealization.label}
            value={formatNumber(data?.sumBudgetRealization) || "-"}
            p={1}
          />
        </SimpleGrid>
      </CContainer>

      <Chart.Root maxH="md" chart={chart} pb={4} pr={4}>
        <LineChart data={chart.data} margin={{ left: 40, right: 40, top: 40 }}>
          <CartesianGrid
            stroke={chart.color("border")}
            strokeDasharray="4 4"
            vertical={false}
          />
          <XAxis
            dataKey={chart.key("months")}
            stroke={chart.color("border")}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            axisLine={false}
            dataKey={chart.key("Target")}
            stroke={chart.color("border")}
            tickFormatter={(value) => formatNumber(value)}
          />

          <Tooltip
            animationDuration={100}
            cursor={{ stroke: chart.color("border") }}
            content={<Chart.Tooltip />}
          />

          <Line
            dot={false}
            dataKey={chart.key("Target")}
            fill={chart.color(themeConfig.primaryColorHex)}
            stroke={chart.color(themeConfig.primaryColorHex)}
            strokeWidth={2}
          >
            {/* <LabelList
              dataKey={chart.key("Target")}
              position="right"
              offset={10}
              style={{
                fontWeight: "600",
                fill: chart.color("fg"),
              }}
            /> */}
          </Line>

          <Line
            dot={false}
            animationDuration={200}
            dataKey={chart.key("Realization")}
            fill={chart.color("orange.400")}
            stroke={chart.color("orange.400")}
            strokeWidth={2}
          >
            {/* <LabelList
              dataKey={chart.key("Target")}
              position="right"
              offset={10}
              style={{
                fontWeight: "600",
                fill: chart.color("fg"),
              }}
            /> */}
          </Line>
        </LineChart>
      </Chart.Root>
    </ItemContainer>
  );
};
const PhysicalLineChart = (props: Props__Chart) => {
  // Props
  const { data, STATS_REGISTRY, ...restProps } = props;

  // Contexts
  const { l, lang } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const chart = useChart({
    data: data?.chartPhysical?.map((item: any, i: number) => ({
      month: MONTHS[lang][i],
      Target: item.target,
      Realization: item.realization,
    })),
  });

  return (
    <ItemContainer {...restProps}>
      <ItemHeaderContainer borderless>
        <ItemHeaderTitle>{`${l.physical} (${capitalizeWords(
          l.target_and_realization
        )})`}</ItemHeaderTitle>
      </ItemHeaderContainer>

      <CContainer
        p={4}
        gap={4}
        bg={"body"}
        rounded={themeConfig.radii.component}
      >
        <SimpleGrid columns={2} gap={4}>
          <StatItem
            label={STATS_REGISTRY.avgPhysicalTarget.label}
            value={`${formatNumber(data?.avgPhysicalTarget)}%` || "-"}
            p={1}
          />

          <StatItem
            label={STATS_REGISTRY.avgPhysicalRealization.label}
            value={`${formatNumber(data?.avgPhysicalRealization)}%` || "-"}
            p={1}
          />
        </SimpleGrid>
      </CContainer>

      <Chart.Root maxH="md" chart={chart} pb={4} pr={4}>
        <LineChart data={chart.data} margin={{ left: 40, right: 40, top: 40 }}>
          <CartesianGrid
            stroke={chart.color("border")}
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey={chart.key("month")}
            tickFormatter={(value) => value.slice(0, 3)}
            stroke={chart.color("border")}
          />
          <YAxis
            axisLine={false}
            dataKey={chart.key("Target")}
            stroke={chart.color("border")}
            tickFormatter={(value) => formatNumber(value)}
          />
          <Tooltip
            animationDuration={100}
            cursor={{ stroke: chart.color("border") }}
            content={<Chart.Tooltip />}
          />
          <Line
            dot={false}
            dataKey={chart.key("Target")}
            fill={chart.color(themeConfig.primaryColorHex)}
            stroke={chart.color(themeConfig.primaryColorHex)}
            strokeWidth={2}
          >
            {/* <LabelList
              dataKey={chart.key("budget")}
              position="right"
              offset={10}
              style={{
                fontWeight: "600",
                fill: chart.color("fg"),
              }}
            /> */}
          </Line>

          <Line
            dot={false}
            dataKey={chart.key("Realization")}
            fill={chart.color("orange.400")}
            stroke={chart.color("orange.400")}
            strokeWidth={2}
          >
            {/* <LabelList
              dataKey={chart.key("budget")}
              position="right"
              offset={10}
              style={{
                fontWeight: "600",
                fill: chart.color("fg"),
              }}
            /> */}
          </Line>
        </LineChart>
      </Chart.Root>
    </ItemContainer>
  );
};

const EditHibahNetworthIDRTrigger = (props: any) => {
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
      title: `Edit ${STATS_REGISTRY?.networthHibahIDR?.label.toLowerCase()}`,
    },
    successMessage: {
      title: `Edit ${STATS_REGISTRY?.networthHibahIDR?.label.toLowerCase()} ${l.successful.toLowerCase()}`,
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      networthHibahIDR: null as number | null,
      networthHibahUSD: null as number | null,
      frameworkFiles: [] as any[],
      planFiles: [] as any[],
      deleteFrameworkFileIds: [],
      deletePlanFileIds: [],
    },
    validationSchema: yup
      .object()
      .shape({ networthHibahIDR: yup.number().required(l.msg_required_form) }),
    onSubmit: (values) => {
      back();

      const payload = new FormData();
      payload.append("hibahIDR", `${values.networthHibahIDR}`);
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
      networthHibahIDR: dashboard?.networthHibahIDR,
      networthHibahUSD: dashboard?.networthHibahUSD,
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
                STATS_REGISTRY?.networthHibahIDR?.label
              )}`}
            />
          </DisclosureHeader>

          <DisclosureBody>
            <form id="edit_hibah_networth" onSubmit={formik.handleSubmit}>
              <FieldRoot disabled={loading}>
                <Field
                  label={"Networth"}
                  invalid={!!formik.errors.networthHibahIDR}
                  errorText={formik.errors.networthHibahIDR as string}
                >
                  <NumInput
                    inputValue={formik.values.networthHibahIDR}
                    onChange={(inputValue) => {
                      formik.setFieldValue("networthHibahIDR", inputValue);
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
const EditHibahNetworthUSDTrigger = (props: any) => {
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
      title: `Edit ${STATS_REGISTRY?.networthHibahUSD?.label.toLowerCase()}`,
    },
    successMessage: {
      title: `Edit ${STATS_REGISTRY?.networthHibahUSD?.label.toLowerCase()} ${l.successful.toLowerCase()}`,
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      networthHibahIDR: null as number | null,
      networthHibahUSD: null as number | null,
      frameworkFiles: [] as any[],
      planFiles: [] as any[],
      deleteFrameworkFileIds: [],
      deletePlanFileIds: [],
    },
    validationSchema: yup
      .object()
      .shape({ networthHibahUSD: yup.number().required(l.msg_required_form) }),
    onSubmit: (values) => {
      back();

      const payload = new FormData();
      payload.append("hibahUSD", `${values.networthHibahUSD}`);
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
      networthHibahIDR: dashboard?.networthHibahIDR,
      networthHibahUSD: dashboard?.networthHibahUSD,
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
                STATS_REGISTRY?.networthHibahUSD?.label
              )}`}
            />
          </DisclosureHeader>

          <DisclosureBody>
            <form id="edit_hibah_networth" onSubmit={formik.handleSubmit}>
              <FieldRoot disabled={loading}>
                <Field
                  label={"Networth"}
                  invalid={!!formik.errors.networthHibahUSD}
                  errorText={formik.errors.networthHibahUSD as string}
                >
                  <NumInput
                    inputValue={formik.values.networthHibahUSD}
                    onChange={(inputValue) => {
                      formik.setFieldValue("networthHibahUSD", inputValue);
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
  const [filter, setFilter] = useState<any>(DEFAULT_FILTER);
  const STATS_REGISTRY = {
    networthHibahIDR: {
      currency: "IDR",
      icon: <IconCoins stroke={1.5} />,
      label: "Networth Hibah IDR",
    },
    networthHibahUSD: {
      currency: "USD",
      icon: <IconCoins stroke={1.5} />,
      label: "Networth Hibah USD",
    },
    totalActivityPackages: {
      icon: <IconActivity stroke={1.5} />,
      label: l.activity_package,
    },
    totalActivityCalendar: {
      icon: <IconCalendarEvent stroke={1.5} />,
      label: "Agenda",
    },
    sumBudgetTarget: {
      icon: <IconMoneybag stroke={1.5} />,
      label: `Total ${l.budget_target.toLowerCase()}`,
    },
    sumBudgetRealization: {
      icon: <IconReceipt stroke={1.5} />,
      label: `Total ${l.budget_realization.toLowerCase()}`,
    },
    avgPhysicalTarget: {
      icon: <IconPercentage stroke={1.5} />,
      label: l.avg_physical_target,
    },
    avgPhysicalRealization: {
      icon: <IconTimeline stroke={1.5} />,
      label: l.avg_physical_realization,
    },
  };
  const { error, initialLoading, data, onRetry } = useDataState<any>({
    // initialData: DUMMY_DASHBOARD_DATA,
    url: `/api/master-data/monev-dashboard/info`,
    dependencies: [filter],
    dataResource: false,
    params: {
      year: filter.year,
    },
    payload: {
      year: filter.year,
    },
  });
  const render = {
    loading: <Skeleton flex={1} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    loaded: (
      <CContainer gap={4}>
        <SimpleGrid columns={[1, null, 2]} gap={4}>
          <HStack
            rounded={themeConfig.radii.component}
            bg={"body"}
            align={"start"}
          >
            <StatItem
              icon={STATS_REGISTRY.networthHibahIDR.icon}
              iconLetter={STATS_REGISTRY.networthHibahIDR.currency}
              label={STATS_REGISTRY.networthHibahIDR.label}
              value={formatNumber(data?.dashboard?.networthHibahIDR) || "-"}
            />

            {isSuperAdmin && (
              <EditHibahNetworthIDRTrigger
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
              </EditHibahNetworthIDRTrigger>
            )}
          </HStack>

          <HStack
            rounded={themeConfig.radii.component}
            bg={"body"}
            align={"start"}
          >
            <StatItem
              icon={STATS_REGISTRY.networthHibahUSD.icon}
              iconLetter={STATS_REGISTRY.networthHibahUSD.currency}
              label={STATS_REGISTRY.networthHibahUSD.label}
              value={formatNumber(data?.dashboard?.networthHibahUSD) || "-"}
            />

            {isSuperAdmin && (
              <EditHibahNetworthUSDTrigger
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
              </EditHibahNetworthUSDTrigger>
            )}
          </HStack>
        </SimpleGrid>

        <HStack justify={"space-between"}>
          <P color={"fg.subtle"}>{l.msg_data_below_shown_by_year}</P>

          <HStack>
            <P color={"fg.muted"}>{l.year}</P>

            <MenuRoot>
              <MenuTrigger asChild>
                <Btn size={"xs"} pr={2} variant={"outline"}>
                  {filter.year}

                  <Icon>
                    <IconCaretDownFilled />
                  </Icon>
                </Btn>
              </MenuTrigger>

              <MenuContent minW={"100px"} w={"100px"}>
                {YEAR_OPTIONS.map((year) => {
                  const isActive = filter.year === year;

                  return (
                    <MenuItem
                      key={year}
                      value={`${year}`}
                      onClick={() => {
                        setFilter({ ...filter, year: year });
                      }}
                    >
                      {year}

                      {isActive && <DotIndicator ml={"auto"} mr={"2px"} />}
                    </MenuItem>
                  );
                })}
              </MenuContent>
            </MenuRoot>
          </HStack>
        </HStack>

        <SimpleGrid columns={[1, null, 2]} gap={4}>
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
          <BudgetLineChart data={data} STATS_REGISTRY={STATS_REGISTRY} />

          <PhysicalLineChart data={data} STATS_REGISTRY={STATS_REGISTRY} />
        </SimpleGrid>

        <SimpleGrid columns={containerWidth < 1100 ? 1 : 2} gap={4}>
          <ItemContainer>
            <ItemHeaderContainer borderless>
              <HStack w={"full"} justify={"space-between"}>
                <ItemHeaderTitle>
                  {capitalizeWords(l.framework_file)}
                </ItemHeaderTitle>

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

            <CContainer>
              {isEmptyArray(data?.dashboard?.frameworkFiles) && (
                <Center aspectRatio={10 / 12} w={"full"}>
                  <FeedbackNoData />
                </Center>
              )}

              {!isEmptyArray(data?.dashboard?.frameworkFiles) && (
                <PDFViewer
                  fileUrl={data?.dashboard?.frameworkFiles[0]?.fileUrl}
                  maxH={containerWidth < 1100 ? "600px" : ""}
                />
              )}
            </CContainer>
          </ItemContainer>

          <ItemContainer>
            <ItemHeaderContainer borderless>
              <HStack w={"full"} justify={"space-between"}>
                <ItemHeaderTitle>
                  {capitalizeWords(l.plan_file)}
                </ItemHeaderTitle>

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

            <CContainer>
              {isEmptyArray(data?.dashboard?.planFiles) && (
                <Center aspectRatio={10 / 12} w={"full"}>
                  <FeedbackNoData />
                </Center>
              )}

              {!isEmptyArray(data?.dashboard?.planFiles) && (
                <PDFViewer
                  fileUrl={data?.dashboard?.planFiles[0]?.fileUrl}
                  maxH={containerWidth < 1100 ? "600px" : ""}
                />
              )}
            </CContainer>
          </ItemContainer>
        </SimpleGrid>
      </CContainer>
    ),
  };

  // console.debug(data);

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
