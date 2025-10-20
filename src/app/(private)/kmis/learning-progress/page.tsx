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
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import BackButton from "@/components/widget/BackButton";
import { ClampText } from "@/components/widget/ClampText";
import { DataDisplayToggle } from "@/components/widget/DataDisplayToggle";
import { DataGrid } from "@/components/widget/DataGrid";
import { DataGridItem } from "@/components/widget/DataGridItem";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { ItemHeaderContainer } from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { QuizAttempStatus } from "@/components/widget/QuizAttempStatus";
import { ReviewQuizWorkspace } from "@/components/widget/ReviewQuizWorkspace";
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import {
  Interface__DataProps,
  Interface__KMISLearningAttempt,
  Interface__KMISQuizResponse,
} from "@/constants/interfaces";
import { useDataDisplay } from "@/context/useDataDisplay";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useDataState from "@/hooks/useDataState";
import { isEmptyArray, last } from "@/utils/array";
import { disclosureId } from "@/utils/disclosure";
import { formatDate, formatDuration, formatNumber } from "@/utils/formatter";
import { capitalizeWords, pluckString } from "@/utils/string";
import { fileUrl, getActiveNavs, imgUrl } from "@/utils/url";
import { HStack, Icon, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import { IconArrowUpRight, IconEye } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const BASE_ENDPOINT = "/api/kmis/learning-participant";
const PREFIX_ID = "kmis_quiz_assessment";
type Interface__Data = Interface__KMISLearningAttempt;

const DataUtils = (props: any) => {
  // Props
  const { filter, setFilter, ...restProps } = props;

  return (
    <HStack p={3} {...restProps}>
      <SearchInput
        inputValue={filter.search}
        onChange={(inputValue) => {
          setFilter({ ...filter, search: inputValue });
        }}
      />

      <DataDisplayToggle navKey={PREFIX_ID} />
    </HStack>
  );
};

const ResultDetail = (props: any) => {
  // Props
  const { attempt, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    disclosureId(`answer-detail-${attempt.id}`),
    open,
    onOpen,
    onClose
  );
  const dataDisplay = useDataDisplay((s) => s.getDisplay("kmis_quiz_attempt"));

  // States
  const resolvedAttempt: Interface__Data = attempt;
  const { error, initialLoading, data, onRetry } = useDataState<{
    learningParticipant: Interface__KMISLearningAttempt;
    exam: Interface__KMISQuizResponse[];
  }>({
    url: `/api/kmis/learning-participant/show/${attempt.id}`,
    dependencies: [open],
    conditions: open,
    dataResource: false,
  });
  const render = {
    loading: <Skeleton w={"full"} h={"400px"} />,
    error: <FeedbackRetry onRetry={onRetry} h={"400px"} />,
    empty: <FeedbackNoData h={"400px"} />,
    loaded: (
      <CContainer gap={4}>
        <SimpleGrid columns={[1, null, 2]} gap={4} px={1}>
          <ItemContainer
            rounded={themeConfig.radii.component}
            border={"1px solid"}
            borderColor={"border.muted"}
          >
            <ItemHeaderContainer borderless>
              <ItemHeaderTitle>{capitalizeWords(l.basic_info)}</ItemHeaderTitle>
            </ItemHeaderContainer>

            <CContainer gap={4} p={4} pt={2}>
              <HStack align={"start"}>
                <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                  {l.name}
                </P>
                <P>:</P>
                <ClampText>{resolvedAttempt.attemptUser.name}</ClampText>
              </HStack>

              <HStack align={"start"}>
                <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                  {"Email"}
                </P>
                <P>:</P>
                <ClampText>{resolvedAttempt.attemptUser.email}</ClampText>
              </HStack>

              <HStack align={"start"}>
                <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                  {l.category}
                </P>
                <P>:</P>
                <ClampText>{resolvedAttempt.topic.category.title}</ClampText>
              </HStack>

              <HStack align={"start"}>
                <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                  {l.private_navs.kmis.topic}
                </P>
                <P>:</P>
                <ClampText>{resolvedAttempt.topic.title}</ClampText>
              </HStack>

              <HStack align={"start"}>
                <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                  {l.description}
                </P>
                <P>:</P>
                <ClampText>{resolvedAttempt.topic.description}</ClampText>
              </HStack>

              <HStack align={"start"}>
                <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                  {l.duration}
                </P>
                <P>:</P>
                <P>{formatDuration(resolvedAttempt.topic.quizDuration)}</P>
              </HStack>

              <HStack align={"start"}>
                <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                  {l.start_date_time}
                </P>
                <P>:</P>
                <P>
                  {formatDate(resolvedAttempt.quizStarted, {
                    variant: "numeric",
                    withTime: true,
                  })}
                </P>
              </HStack>

              <HStack align={"start"}>
                <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                  {l.end_date_time}
                </P>
                <P>:</P>
                <P>
                  {formatDate(resolvedAttempt.quizFinished, {
                    variant: "numeric",
                    withTime: true,
                  })}
                </P>
              </HStack>
            </CContainer>
          </ItemContainer>

          <ItemContainer
            rounded={themeConfig.radii.component}
            border={"1px solid"}
            borderColor={"border.muted"}
          >
            <ItemHeaderContainer borderless>
              <ItemHeaderTitle>{capitalizeWords(l.quiz_info)}</ItemHeaderTitle>
            </ItemHeaderContainer>

            <CContainer gap={4} p={4} pt={2}>
              <HStack align={"start"}>
                <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                  {l.progress_status}
                </P>
                <P>:</P>
                <QuizAttempStatus
                  quizAttempStatus={resolvedAttempt.attemptStatus}
                />
              </HStack>

              <HStack align={"start"}>
                <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                  {l.grade}
                </P>
                <P>:</P>
                <P>{`${resolvedAttempt.scoreTotal}`}</P>
              </HStack>

              <HStack align={"start"}>
                <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                  {l.total_answered}
                </P>
                <P>:</P>
                <P>{formatNumber(resolvedAttempt.questionsAnswered || 0)}</P>
              </HStack>

              <HStack align={"start"}>
                <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                  {l.total_correct}
                </P>
                <P>:</P>
                <P>{formatNumber(resolvedAttempt.correctCount)}</P>
              </HStack>

              <HStack align={"start"}>
                <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                  {l.total_wrong}
                </P>
                <P>:</P>
                <P>{formatNumber(resolvedAttempt.wrongCount)}</P>
              </HStack>

              <HStack align={"start"}>
                <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                  {l.total_empty}
                </P>
                <P>:</P>
                <P>{formatNumber(resolvedAttempt.emptyCount)}</P>
              </HStack>

              <HStack align={"start"}>
                <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                  Feedback
                </P>
                <P>:</P>
                <P>{resolvedAttempt.feedback || "-"}</P>
              </HStack>

              <HStack align={"start"}>
                <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                  {l.certificate}
                </P>
                <P>:</P>
                <NavLink
                  to={fileUrl(resolvedAttempt.certificate?.[0]?.filePath)}
                  external
                >
                  <Btn
                    variant={"plain"}
                    p={0}
                    h={"fit"}
                    color={`${themeConfig.colorPalette}.fg`}
                  >
                    {l.view}
                    <Icon boxSize={5}>
                      <IconArrowUpRight stroke={1.5} />
                    </Icon>
                  </Btn>
                </NavLink>
              </HStack>
            </CContainer>
          </ItemContainer>
        </SimpleGrid>

        <ReviewQuizWorkspace quizResponses={data} px={1} />
      </CContainer>
    ),
  };

  return (
    <>
      <Btn
        size={"xs"}
        variant={dataDisplay === "table" ? "ghost" : "outline"}
        colorPalette={themeConfig.colorPalette}
        pl={"6px"}
        onClick={onOpen}
        {...restProps}
      >
        <Icon boxSize={5}>
          <IconEye stroke={1.5} />
        </Icon>

        {l.view}
      </Btn>

      <DisclosureRoot open={open} lazyLoad size={"xl"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={`${capitalizeWords(l.result_detail)}`}
            />
          </DisclosureHeader>

          <DisclosureBody>
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
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
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
    url: `${BASE_ENDPOINT}/index`,
    params: filter,
    dependencies: [filter],
  });
  const dataProps: Interface__DataProps = {
    headers: [
      {
        th: l.private_navs.kmis.topic,
        sortable: true,
      },
      {
        th: l.private_navs.kmis.student,
        sortable: true,
      },
      {
        th: l.start_date_time,
        sortable: true,
      },
      {
        th: l.progress_status,
        sortable: true,
        align: "center",
      },
      {
        th: l.grade,
        sortable: true,
        align: "center",
      },
      {
        th: l.result_detail,
        align: "center",
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
      {
        th: l.deleted,
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
          td: <ClampText>{item.topic.title}</ClampText>,
          value: item.topic.title,
        },
        {
          td: <ClampText>{item.attemptUser.name}</ClampText>,
          value: item.attemptUser.name,
        },
        {
          td: formatDate(item.quizStarted, {
            variant: "numeric",
            withTime: true,
          }),
          value: item.quizStarted,
        },
        {
          td: <QuizAttempStatus quizAttempStatus={item.attemptStatus} />,
          value: item.attemptStatus,
          dataType: "number",
          align: "center",
        },
        {
          td: `${item.scoreTotal}`,
          value: item.scoreTotal,
          dataType: "number",
          align: "center",
        },
        {
          td: <ResultDetail attempt={item} />,
          value: "",
          align: "center",
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
        {
          td: formatDate(item.deletedAt, {
            variant: "numeric",
            withTime: true,
            dashEmpty: true,
          }),
          value: item.deletedAt,
          dataType: "date",
        },
      ],
    })),
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
                showImg: true,
                img: imgUrl(resolvedItem.topic.topicCover?.[0]?.filePath),
                title: resolvedItem.topic.title,
                description: resolvedItem.attemptUser.name,
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
