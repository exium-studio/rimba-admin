"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { CSpinner } from "@/components/ui/c-spinner";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
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
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import { dummy_quiz_assessment, dummy_quiz_response } from "@/constants/dummy";
import {
  Interface__DataProps,
  Interface__KMISQuizAssessment,
  Interface__KMISQuizResponse,
} from "@/constants/interfaces";
import { useDataDisplay } from "@/context/useDataDisplay";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useDataState from "@/hooks/useDataState";
import { isEmptyArray, last } from "@/utils/array";
import { disclosureId } from "@/utils/disclosure";
import { formatDate, formatDuration } from "@/utils/formatter";
import { capitalizeWords, pluckString } from "@/utils/string";
import { getEpochMilliseconds } from "@/utils/time";
import { getActiveNavs, imgUrl } from "@/utils/url";
import {
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { IconEye } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const BASE_ENDPOINT = "/api/kmis/learning-participant";
const PREFIX_ID = "kmis_quiz_assessment";
type Interface__Data = Interface__KMISQuizAssessment;

const AnswerDetail = (props: any) => {
  // Props
  const { assessment, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    disclosureId(`answer-detail-${getEpochMilliseconds()}`),
    open,
    onOpen,
    onClose
  );

  const resolvedAssessment: Interface__Data = assessment;
  const { error, initialLoading, data, onRetry } = useDataState<
    Interface__KMISQuizResponse[]
  >({
    initialData: dummy_quiz_response,
    // url: `/api/kmis/learning-participant/show/${assessment.id}`,
    dependencies: [],
    dataResource: false,
  });
  const render = {
    loading: <CSpinner />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    loaded: <></>,
  };

  return (
    <>
      <Btn
        size={"xs"}
        variant={"subtle"}
        colorPalette={themeConfig.colorPalette}
        pl={2}
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
            <DisclosureHeaderContent title={`${l.result_detail}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <SimpleGrid columns={[1, null, 2]} gap={4}>
              <ItemContainer
                rounded={themeConfig.radii.component}
                border={"1px solid"}
                borderColor={"border.muted"}
              >
                <ItemHeaderContainer>
                  <ItemHeaderTitle>
                    {capitalizeWords(l.basic_info)}
                  </ItemHeaderTitle>
                </ItemHeaderContainer>

                <CContainer gap={4} p={4}>
                  <HStack align={"start"}>
                    <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                      {l.name}
                    </P>
                    <P>:</P>
                    <P>{resolvedAssessment.attemptUser.name}</P>
                  </HStack>

                  <HStack align={"start"}>
                    <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                      {"Email"}
                    </P>
                    <P>:</P>
                    <P>{resolvedAssessment.attemptUser.email}</P>
                  </HStack>

                  <HStack align={"start"}>
                    <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                      {l.private_navs.kmis.category}
                    </P>
                    <P>:</P>
                    <P>{resolvedAssessment.topic.category.title}</P>
                  </HStack>

                  <HStack align={"start"}>
                    <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                      {l.private_navs.kmis.topic}
                    </P>
                    <P>:</P>
                    <P>{resolvedAssessment.topic.title}</P>
                  </HStack>

                  <HStack align={"start"}>
                    <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                      {l.description}
                    </P>
                    <P>:</P>
                    <P>{resolvedAssessment.topic.description}</P>
                  </HStack>

                  <HStack align={"start"}>
                    <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                      {l.duration}
                    </P>
                    <P>:</P>
                    <P>
                      {formatDuration(resolvedAssessment.topic.quizDuration)}
                    </P>
                  </HStack>
                </CContainer>
              </ItemContainer>

              <ItemContainer
                rounded={themeConfig.radii.component}
                border={"1px solid"}
                borderColor={"border.muted"}
              >
                <ItemHeaderContainer>
                  <ItemHeaderTitle>
                    {capitalizeWords(l.quiz_info)}
                  </ItemHeaderTitle>
                </ItemHeaderContainer>

                <CContainer gap={4} p={4}>
                  <HStack align={"start"}>
                    <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                      {l.start_date_time}
                    </P>
                    <P>:</P>
                    <P>{resolvedAssessment.attemptUser.name}</P>
                  </HStack>

                  <HStack align={"start"}>
                    <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                      {l.end_date_time}
                    </P>
                    <P>:</P>
                    <P>{resolvedAssessment.attemptUser.name}</P>
                  </HStack>

                  <HStack align={"start"}>
                    <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                      {l.attemp_status}
                    </P>
                    <P>:</P>
                    <QuizAttempStatus
                      quizAttempStatus={resolvedAssessment.attemptStatus}
                    />
                  </HStack>

                  <HStack align={"start"}>
                    <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                      {l.grade}
                    </P>
                    <P>:</P>
                    <P>{`${resolvedAssessment.scoreTotal}`}</P>
                  </HStack>

                  <HStack align={"start"}>
                    <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                      {l.correct_answer}
                    </P>
                    <P>:</P>
                    <P>{`${resolvedAssessment.correctCount}`}</P>
                  </HStack>

                  <HStack align={"start"}>
                    <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                      {l.wrong_answer}
                    </P>
                    <P>:</P>
                    <P>{`${resolvedAssessment.wrongCount}`}</P>
                  </HStack>

                  <HStack align={"start"}>
                    <P w={"120px"} color={"fg.muted"} flexShrink={0}>
                      {l.empty_answer}
                    </P>
                    <P>:</P>
                    <P>{`${resolvedAssessment.emptyCount}`}</P>
                  </HStack>
                </CContainer>
              </ItemContainer>
            </SimpleGrid>

            <Stack flexDir={["column", null, "row"]}>
              <CContainer></CContainer>

              <CContainer></CContainer>
            </Stack>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

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
const Data = (props: any) => {
  // Props
  const { filter, routeTitle } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
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
    initialData: dummy_quiz_assessment,
    // url: `${BASE_ENDPOINT}/index`,
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
        th: l.attemp_status,
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
          td: (
            <P>
              {formatDate(item.quizStarted, {
                variant: "numeric",
                withTime: true,
              })}
            </P>
          ),
          value: item.quizStarted,
        },
        {
          td: <QuizAttempStatus quizAttempStatus={item.attemptStatus} />,
          value: item.attemptStatus,
          dataType: "number",
          align: "center",
        },
        {
          td: <P>{`${item.scoreTotal}`}</P>,
          value: item.scoreTotal,
          dataType: "number",
          align: "center",
        },
        {
          td: <AnswerDetail assessment={item} />,
          value: "",
          align: "center",
        },

        // timestamps
        {
          td: (
            <P>
              {formatDate(item.createdAt, {
                variant: "numeric",
                withTime: true,
              })}
            </P>
          ),
          value: item.createdAt,
          dataType: "date",
          dashEmpty: true,
        },
        {
          td: (
            <P>
              {formatDate(item.updatedAt, {
                variant: "numeric",
                withTime: true,
                dashEmpty: true,
              })}
            </P>
          ),
          value: item.updatedAt,
          dataType: "date",
        },
        {
          td: (
            <P>
              {formatDate(item.deletedAt, {
                variant: "numeric",
                withTime: true,
                dashEmpty: true,
              })}
            </P>
          ),
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
