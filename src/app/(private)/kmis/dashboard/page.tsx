"use client";

import { CContainer } from "@/components/ui/c-container";
import { Skeleton } from "@/components/ui/skeleton";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { PageContainer, PageContent } from "@/components/widget/Page";
import useLang from "@/context/useLang";
import useDataState from "@/hooks/useDataState";
import { SimpleGrid } from "@chakra-ui/react";
import { IconBubbleText, IconHexagon } from "@tabler/icons-react";

export default function KMISDashboardPage() {
  // Contexts
  const { l } = useLang();

  // States
  const TOTAL_REGISTRY = {
    averageFeedback: {
      icon: <IconBubbleText stroke={1.5} />,
      label: l.average_rating,
    },
    averageScoreTotal: {
      icon: <IconHexagon stroke={1.5} />,
      label: l.average_quiz_score,
    },
    totalEducator: {
      icon: <IconHexagon stroke={1.5} />,
      label: l.total_educator,
    },
    total_student: {
      icon: <IconHexagon stroke={1.5} />,
      label: l.total_student,
    },
    total_material: {
      icon: <IconHexagon stroke={1.5} />,
      label: l.total_material,
    },
    total_topic: {
      icon: <IconHexagon stroke={1.5} />,
      label: l.total_topic,
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
        <SimpleGrid columns={[2, null, 4]} gap={4}></SimpleGrid>
      </CContainer>
    ),
  };

  console.debug(data, TOTAL_REGISTRY);

  return (
    <PageContainer>
      <PageContent>
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
      </PageContent>
    </PageContainer>
  );
}
