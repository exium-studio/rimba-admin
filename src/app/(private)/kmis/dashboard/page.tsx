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
  IconBook2,
  IconBooks,
  IconChalkboardTeacher,
  IconHelpHexagon,
  IconSchool,
  IconStar,
  IconUsers,
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
interface Props__UserFinishedAttempt extends StackProps {
  data: any;
}
const UserFinishedAttempt = (props: Props__UserFinishedAttempt) => {
  // Props
  const { data, ...restProps } = props;

  // Contexts
  const { l, lang } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const chart = useChart({
    data: data?.userStatsAttemptFinished?.map((item: any, i: number) => ({
      month: MONTHS[lang][i],
      user: item.value,
    })),
  });

  return (
    <ItemContainer {...restProps}>
      <ItemHeaderContainer borderless>
        <ItemHeaderTitle>{l.total_completed_topic_by_user}</ItemHeaderTitle>
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
            dataKey={chart.key("user")}
            fill={chart.color(themeConfig.primaryColorHex)}
            stroke={chart.color(themeConfig.primaryColorHex)}
            strokeWidth={2}
          >
            <LabelList
              dataKey={chart.key("user")}
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
    totalEducator: {
      icon: <IconChalkboardTeacher stroke={1.5} />,
      label: l.total_educator,
    },
    totalStudent: {
      icon: <IconSchool stroke={1.5} />,
      label: l.total_student,
    },
    totalTopic: {
      icon: <IconBook2 stroke={1.5} />,
      label: l.total_topic,
    },
    totalMaterial: {
      icon: <IconBooks stroke={1.5} />,
      label: l.total_material,
    },
    averageScoreTotal: {
      icon: <IconHelpHexagon stroke={1.5} />,
      label: l.average_quiz_score,
    },
    averageFeedback: {
      icon: <IconStar stroke={1.5} />,
      label: l.average_rating,
    },
    totalUserAttemptParticipant: {
      icon: <IconUsers stroke={1.5} />,
      label: l.total_user_learning_attempt,
    },
  };
  const { error, initialLoading, data, onRetry } = useDataState<any>({
    initialData: undefined,
    url: `/api/kmis/dashboard/info`,
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
            icon={STATS_REGISTRY.totalEducator.icon}
            label={STATS_REGISTRY.totalEducator.label}
            value={formatNumber(data?.totalEducator?.value) || "-"}
          />

          <StatItem
            icon={STATS_REGISTRY.totalStudent.icon}
            label={STATS_REGISTRY.totalStudent.label}
            value={formatNumber(data?.totalStudent?.value) || "-"}
          />

          <StatItem
            icon={STATS_REGISTRY.totalTopic.icon}
            label={STATS_REGISTRY.totalTopic.label}
            value={formatNumber(data?.totalTopic?.value) || "-"}
          />

          <StatItem
            icon={STATS_REGISTRY.totalMaterial.icon}
            label={STATS_REGISTRY.totalMaterial.label}
            value={formatNumber(data?.totalMaterial?.value) || "-"}
          />

          {/* <StatItem
            icon={STATS_REGISTRY.averageScoreTotal.icon}
            label={STATS_REGISTRY.averageScoreTotal.label}
            value={formatNumber(data?.averageScoreTotal?.value) || "-"}
          /> */}

          <StatItem
            icon={STATS_REGISTRY.averageFeedback.icon}
            label={STATS_REGISTRY.averageFeedback.label}
            value={formatNumber(data?.averageFeedback?.value) || "-"}
          />

          <StatItem
            icon={STATS_REGISTRY.totalUserAttemptParticipant.icon}
            label={STATS_REGISTRY.totalUserAttemptParticipant.label}
            value={
              formatNumber(data?.totalUserAttemptParticipant?.value) || "-"
            }
          />
        </SimpleGrid>

        <UserFinishedAttempt data={data} />
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
