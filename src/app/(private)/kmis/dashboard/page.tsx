"use client";

import { CContainer } from "@/components/ui/c-container";
import { Skeleton } from "@/components/ui/skeleton";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { PageContainer, PageContent } from "@/components/widget/Page";
import useDataState from "@/hooks/useDataState";

export default function KMISDashboardPage() {
  const { error, initialLoading, data, onRetry } = useDataState<any>({
    initialData: undefined,
    url: `/api/kmis/dashboard/info`,
    dependencies: [],
    dataResource: false,
  });
  const render = {
    loading: <Skeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    loaded: <CContainer></CContainer>,
  };

  console.debug(data);

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
