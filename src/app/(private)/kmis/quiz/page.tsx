"use client";

import { Btn } from "@/components/ui/btn";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { Field } from "@/components/ui/field";
import { MenuItem } from "@/components/ui/menu";
import SearchInput from "@/components/ui/search-input";
import { StringInput } from "@/components/ui/string-input";
import { Textarea } from "@/components/ui/textarea";
import { ClampText } from "@/components/widget/ClampText";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { DataDisplayToggle } from "@/components/widget/DataDisplayToggle";
import { DataGrid } from "@/components/widget/DataGrid";
import { DataGridItem } from "@/components/widget/DataGridItem";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import {
  Interface__BatchOptionsTableOptionGenerator,
  Interface__DataProps,
  Interface__KMISQuiz,
  Interface__RowOptionsTableOptionGenerator,
  Interface__SelectOption,
} from "@/constants/interfaces";
import { SVGS_PATH } from "@/constants/paths";
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
import { formatDate } from "@/utils/formatter";
import { capitalize, pluckString } from "@/utils/string";
import { getActiveNavs, imgUrl } from "@/utils/url";
import { FieldsetRoot, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import {
  IconActivity,
  IconPencilMinus,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";

const BASE_ENDPOINT = "/api/kmis/quiz";
const PREFIX_ID = "kmis_quiz";
type Interface__Data = Interface__KMISQuiz;

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
  useBackOnClose(disclosureId(ID), open, onOpen, onClose);
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${l.add} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${routeTitle} ${l.successful}`),
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      topic: null as unknown as Interface__SelectOption[],
      question: "",
      answerA: "",
      answerB: "",
      answerC: "",
      answerD: "",
      correctOption: "",
      explanation: "",
    },
    validationSchema: yup.object().shape({
      topic: yup.array().required(l.msg_required_form),
      question: yup.string().required(l.msg_required_form),
      answerA: yup.string().required(l.msg_required_form),
      answerB: yup.string().required(l.msg_required_form),
      answerC: yup.string().required(l.msg_required_form),
      answerD: yup.string().required(l.msg_required_form),
      correctOption: yup.string().required(l.msg_required_form),
      explanation: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = new FormData();
      payload.append("topic", `${values.topic?.[0]?.id}`);
      payload.append("question", values.question);
      payload.append("answerA", values.answerA);
      payload.append("answerB", values.answerB);
      payload.append("answerC", values.answerC);
      payload.append("answerD", values.answerD);
      payload.append("correctOption", values.correctOption);
      payload.append("explanation", values.explanation);

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
            back();
            setRt((ps) => !ps);
          },
        },
      });
    },
  });

  return (
    <>
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

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${l.add} ${routeTitle}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <form id={ID} onSubmit={formik.handleSubmit}>
              <FieldsetRoot disabled={loading}>
                <Field
                  label={l.private_navs.kmis.topic}
                  invalid={!!formik.errors.topic}
                  errorText={formik.errors.topic as string}
                >
                  {/* <SelectTopic /> */}
                </Field>

                <Field
                  label={l.question}
                  invalid={!!formik.errors.question}
                  errorText={formik.errors.question as string}
                >
                  <Textarea
                    inputValue={formik.values.question}
                    onChange={(inputValue) => {
                      formik.setFieldValue("question", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={`${l.option} A`}
                  invalid={!!formik.errors.answerA}
                  errorText={formik.errors.answerA as string}
                >
                  <StringInput
                    inputValue={formik.values.answerA}
                    onChange={(inputValue) => {
                      formik.setFieldValue("answerA", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={`${l.option} B`}
                  invalid={!!formik.errors.answerB}
                  errorText={formik.errors.answerB as string}
                >
                  <StringInput
                    inputValue={formik.values.answerB}
                    onChange={(inputValue) => {
                      formik.setFieldValue("answerB", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={`${l.option} C`}
                  invalid={!!formik.errors.answerC}
                  errorText={formik.errors.answerC as string}
                >
                  <StringInput
                    inputValue={formik.values.answerC}
                    onChange={(inputValue) => {
                      formik.setFieldValue("answerC", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={`${l.option} D`}
                  invalid={!!formik.errors.answerD}
                  errorText={formik.errors.answerD as string}
                >
                  <StringInput
                    inputValue={formik.values.answerD}
                    onChange={(inputValue) => {
                      formik.setFieldValue("answerD", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={`${l.correct_answer}`}
                  invalid={!!formik.errors.correctOption}
                  errorText={formik.errors.correctOption as string}
                >
                  <StringInput
                    inputValue={formik.values.correctOption}
                    onChange={(inputValue) => {
                      formik.setFieldValue("correctOption", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.explanation}
                  invalid={!!formik.errors.explanation}
                  errorText={formik.errors.explanation as string}
                >
                  <Textarea
                    inputValue={formik.values.explanation}
                    onChange={(inputValue) => {
                      formik.setFieldValue("explanation", inputValue);
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
      topic: null as unknown as Interface__SelectOption[],
      question: "",
      answerA: "",
      answerB: "",
      answerC: "",
      answerD: "",
      correctOption: "",
      explanation: "",
    },
    validationSchema: yup.object().shape({
      topic: yup.array().required(l.msg_required_form),
      question: yup.string().required(l.msg_required_form),
      answerA: yup.string().required(l.msg_required_form),
      answerB: yup.string().required(l.msg_required_form),
      answerC: yup.string().required(l.msg_required_form),
      answerD: yup.string().required(l.msg_required_form),
      correctOption: yup.string().required(l.msg_required_form),
      explanation: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = new FormData();
      payload.append("topic", `${values.topic?.[0]?.id}`);
      payload.append("question", values.question);
      payload.append("answerA", values.answerA);
      payload.append("answerB", values.answerB);
      payload.append("answerC", values.answerC);
      payload.append("answerD", values.answerD);
      payload.append("correctOption", values.correctOption);
      payload.append("explanation", values.explanation);

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
            back();
            setRt((ps) => !ps);
          },
        },
      });
    },
  });

  useEffect(() => {
    formik.setValues({
      topic: [
        {
          id: resolvedData.topic.id,
          label: resolvedData.topic.title,
        },
      ],
      question: resolvedData.question,
      answerA: resolvedData.answerA,
      answerB: resolvedData.answerB,
      answerC: resolvedData.answerC,
      answerD: resolvedData.answerD,
      correctOption: resolvedData.correctOption,
      explanation: resolvedData.explanation,
    });
  }, [open, resolvedData]);

  return (
    <>
      <MenuItem value="edit" onClick={onOpen}>
        Edit
        <Icon boxSize={"18px"} ml={"auto"}>
          <IconPencilMinus stroke={1.5} />
        </Icon>
      </MenuItem>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`Edit ${routeTitle}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <form id={ID} onSubmit={formik.handleSubmit}>
              <FieldsetRoot disabled={loading}>
                <Field
                  label={l.private_navs.kmis.topic}
                  invalid={!!formik.errors.topic}
                  errorText={formik.errors.topic as string}
                >
                  {/* <SelectTopic /> */}
                </Field>

                <Field
                  label={l.question}
                  invalid={!!formik.errors.question}
                  errorText={formik.errors.question as string}
                >
                  <Textarea
                    inputValue={formik.values.question}
                    onChange={(inputValue) => {
                      formik.setFieldValue("question", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={`${l.option} A`}
                  invalid={!!formik.errors.answerA}
                  errorText={formik.errors.answerA as string}
                >
                  <StringInput
                    inputValue={formik.values.answerA}
                    onChange={(inputValue) => {
                      formik.setFieldValue("answerA", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={`${l.option} B`}
                  invalid={!!formik.errors.answerB}
                  errorText={formik.errors.answerB as string}
                >
                  <StringInput
                    inputValue={formik.values.answerB}
                    onChange={(inputValue) => {
                      formik.setFieldValue("answerB", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={`${l.option} C`}
                  invalid={!!formik.errors.answerC}
                  errorText={formik.errors.answerC as string}
                >
                  <StringInput
                    inputValue={formik.values.answerC}
                    onChange={(inputValue) => {
                      formik.setFieldValue("answerC", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={`${l.option} D`}
                  invalid={!!formik.errors.answerD}
                  errorText={formik.errors.answerD as string}
                >
                  <StringInput
                    inputValue={formik.values.answerD}
                    onChange={(inputValue) => {
                      formik.setFieldValue("answerD", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={`${l.correct_answer}`}
                  invalid={!!formik.errors.correctOption}
                  errorText={formik.errors.correctOption as string}
                >
                  <StringInput
                    inputValue={formik.values.correctOption}
                    onChange={(inputValue) => {
                      formik.setFieldValue("correctOption", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.explanation}
                  invalid={!!formik.errors.explanation}
                  errorText={formik.errors.explanation as string}
                >
                  <Textarea
                    inputValue={formik.values.explanation}
                    onChange={(inputValue) => {
                      formik.setFieldValue("explanation", inputValue);
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
const Activate = (props: any) => {
  const ID = `${PREFIX_ID}_activate`;

  // Props
  const { activateAccountIds, clearSelectedRows, disabled, routeTitle } = props;

  // Contexts
  const { l } = useLang();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${l.activate} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${l.activate} ${routeTitle} ${l.successful}`),
    },
  });

  // Utils
  function onActivate() {
    back();
    req({
      config: {
        url: `${BASE_ENDPOINT}/activate`,
        method: "PATCH",
        data: {
          activateAccountIds: activateAccountIds,
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
      id={`${ID}-${activateAccountIds}`}
      title={`${l.activate} ${routeTitle}`}
      description={l.msg_activate}
      confirmLabel={`${l.activate}`}
      onConfirm={onActivate}
      loading={loading}
      disabled={disabled}
    >
      <MenuItem value="restore" disabled={disabled}>
        {l.activate}
        <Icon boxSize={"18px"} ml={"auto"}>
          <IconActivity stroke={1.5} />
        </Icon>
      </MenuItem>
    </ConfirmationDisclosureTrigger>
  );
};
const Deactivate = (props: any) => {
  const ID = `${PREFIX_ID}_deactivate`;

  // Props
  const { deactivateAccountIds, clearSelectedRows, disabled, routeTitle } =
    props;

  // Contexts
  const { l } = useLang();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${l.deactivate} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${l.deactivate} ${routeTitle} ${l.successful}`),
    },
  });

  // Utils
  function onDeactivate() {
    back();
    req({
      config: {
        url: `${BASE_ENDPOINT}/deactivate`,
        method: "PATCH",
        data: {
          deactivateAccountIds: deactivateAccountIds,
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
      id={`${ID}-${deactivateAccountIds}`}
      title={`${l.deactivate} ${routeTitle}`}
      description={l.msg_deactivate}
      confirmLabel={`${l.deactivate}`}
      onConfirm={onDeactivate}
      confirmButtonProps={{
        color: "fg.error",
        colorPalette: "gray",
        variant: "outline",
      }}
      loading={loading}
      disabled={disabled}
    >
      <MenuItem value="delete" color={"fg.error"} disabled={disabled}>
        {l.deactivate}
        <Icon boxSize={"18px"} ml={"auto"}>
          <IconX stroke={1.5} />
        </Icon>
      </MenuItem>
    </ConfirmationDisclosureTrigger>
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
        th: l.private_navs.kmis.topic,
        sortable: true,
      },
      {
        th: l.question,
        sortable: true,
      },
      {
        th: `${l.option} A`,
        sortable: true,
      },
      {
        th: `${l.option} B`,
        sortable: true,
      },
      {
        th: `${l.option} C`,
        sortable: true,
      },
      {
        th: `${l.option} D`,
        sortable: true,
      },
      {
        th: l.correct_answer,
        sortable: true,
      },
      {
        th: l.explanation,
        sortable: true,
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
          td: <ClampText>{item.question}</ClampText>,
          value: item.question,
        },
        {
          td: <ClampText>{item.answerA}</ClampText>,
          value: item.answerA,
        },
        {
          td: <ClampText>{item.answerB}</ClampText>,
          value: item.answerB,
        },
        {
          td: <ClampText>{item.answerB}</ClampText>,
          value: item.answerB,
        },
        {
          td: <ClampText>{item.answerD}</ClampText>,
          value: item.answerD,
        },
        {
          td: <ClampText>{item.correctOption}</ClampText>,
          value: item.correctOption,
        },
        {
          td: <ClampText>{item.explanation}</ClampText>,
          value: item.explanation,
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
    rowOptions: [
      (row) => ({
        override: <Update data={row.data} routeTitle={routeTitle} />,
      }),
      (row) => ({
        override: (
          <Activate
            activateAccountIds={[row.data.id]}
            disabled={!row.data.deletedAt}
            routeTitle={routeTitle}
          />
        ),
      }),
      (row) => ({
        override: (
          <Deactivate
            deactivateAccountIds={[row.data.id]}
            disabled={!!row.data.deletedAt}
            routeTitle={routeTitle}
          />
        ),
      }),
    ] as Interface__RowOptionsTableOptionGenerator<Interface__Data>[],
    batchOptions: [
      (ids, { clearSelectedRows }) => ({
        override: (
          <Activate
            activateAccountIds={ids}
            clearSelectedRows={clearSelectedRows}
            disabled={
              isEmptyArray(ids) ||
              data
                ?.filter((item) => ids.includes(item.id))
                .some((item) => !item.deletedAt)
            }
            routeTitle={routeTitle}
          />
        ),
      }),
      (ids, { clearSelectedRows }) => ({
        override: (
          <Deactivate
            deactivateAccountIds={ids}
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
                showImg: true,
                img: imgUrl(resolvedItem.topic.topicCover?.[0]?.filePath),
                imgFallbackSrc: `${SVGS_PATH}/no-avatar.svg`,
                title: resolvedItem.question,
                description: resolvedItem.topic.title,
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
