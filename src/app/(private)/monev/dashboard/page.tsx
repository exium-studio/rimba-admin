"use client";

import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { ItemHeaderContainer } from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import { PageContainer } from "@/components/widget/Page";
import { MONTHS } from "@/constants/months";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useDataState from "@/hooks/useDataState";
import { hexWithOpacity } from "@/utils/color";
import { formatNumber } from "@/utils/formatter";
import { Chart, useChart } from "@chakra-ui/charts";
import { Circle, HStack, Icon, SimpleGrid, StackProps } from "@chakra-ui/react";
import {
  IconActivity,
  IconCalendarEvent,
  IconCoins,
  IconMoneybag,
  IconPercentage,
  IconTimeline,
} from "@tabler/icons-react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Tooltip,
  XAxis,
} from "recharts";

interface Props__StatItem extends StackProps {
  icon: any;
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
      <Circle
        p={3}
        bg={iconBg || `${hexWithOpacity(themeConfig.primaryColorHex, 0.075)}`}
      >
        <Icon boxSize={8} color={themeConfig.primaryColorHex}>
          {icon}
        </Icon>
      </Circle>

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

export default function KMISDashboardPage() {
  // Contexts
  const { l } = useLang();

  // States
  const STATS_REGISTRY = {
    totalActivityPackages: {
      icon: <IconActivity stroke={1.5} />,
      label: l.activity_package_information,
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
      icon: <IconCoins stroke={1.5} />,
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
        <SimpleGrid columns={[2, null, 3]} gap={4}>
          <StatItem
            icon={STATS_REGISTRY.totalActivityPackages.icon}
            label={STATS_REGISTRY.totalActivityPackages.label}
            value={formatNumber(data?.totalActivityPackages) || "-"}
          />

          <StatItem
            icon={STATS_REGISTRY.sumBudgetTarget.icon}
            label={STATS_REGISTRY.sumBudgetTarget.label}
            value={formatNumber(data?.sumBudgetTarget) || "-"}
          />

          <StatItem
            icon={STATS_REGISTRY.avgPhysicalTarget.icon}
            label={STATS_REGISTRY.avgPhysicalTarget.label}
            value={`${formatNumber(data?.avgPhysicalTarget)}%` || "-"}
          />

          <StatItem
            icon={STATS_REGISTRY.sumBudgetRealization.icon}
            label={STATS_REGISTRY.sumBudgetRealization.label}
            value={formatNumber(data?.sumBudgetRealization) || "-"}
          />

          <StatItem
            icon={STATS_REGISTRY.avgProgressRealization.icon}
            label={STATS_REGISTRY.avgProgressRealization.label}
            value={`${formatNumber(data?.avgProgressRealization)}%` || "-"}
          />

          <StatItem
            icon={STATS_REGISTRY.totalActivityCalendar.icon}
            label={STATS_REGISTRY.totalActivityCalendar.label}
            value={formatNumber(data?.totalActivityCalendar) || "-"}
          />
        </SimpleGrid>

        <BudgetTargetLineChart data={data} />

        <BudgetRealizationLineChart data={data} />
      </CContainer>
    ),
  };

  return (
    <PageContainer>
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
