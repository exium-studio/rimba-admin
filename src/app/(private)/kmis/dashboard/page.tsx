"use client";

import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { PageContainer } from "@/components/widget/Page";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useDataState from "@/hooks/useDataState";
import { hexWithOpacity } from "@/utils/color";
import { formatNumber } from "@/utils/formatter";
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
        <P fontWeight={"medium"} color={"fg.subtle"}>
          {label}
        </P>

        <P fontSize={"xl"} fontWeight={"bold"}>
          {value}
        </P>
      </CContainer>
    </HStack>
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
      <CContainer>
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
