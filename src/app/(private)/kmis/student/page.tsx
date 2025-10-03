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
import { FileInput } from "@/components/ui/file-input";
import { MenuItem } from "@/components/ui/menu";
import SearchInput from "@/components/ui/search-input";
import { StringInput } from "@/components/ui/string-input";
import { Textarea } from "@/components/ui/textarea";
import { AccountStatus } from "@/components/widget/AccountStatus";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { DataGrid } from "@/components/widget/DataGrid";
import { DataTable } from "@/components/widget/DataTable";
import { DeletedStatus } from "@/components/widget/DeletedStatus";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { MiniUser } from "@/components/widget/MiniUser";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import {
  Interface__BatchOptionsTableOptionGenerator,
  Interface__DataProps,
  Interface__KMISStudent,
  Interface__KMISTopicCategory,
  Interface__RowOptionsTableOptionGenerator,
} from "@/constants/interfaces";
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
import { formatDate, formatNumber } from "@/utils/formatter";
import { capitalize, pluckString } from "@/utils/string";
import { getActiveNavs } from "@/utils/url";
import { fileValidation } from "@/utils/validationSchema";
import { FieldsetRoot, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import {
  IconActivity,
  IconLayoutGrid,
  IconPencilMinus,
  IconTable,
  IconX,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";

const BASE_ENDPOINT = "/api/kmis/student";
const PREFIX_ID = "student";
type Interface__Data = Interface__KMISStudent;

const Update = (props: any) => {
  const ID = `${PREFIX_ID}_update`;

  // Props
  const { data, routeTitle } = props;
  const resolvedData = data as Interface__KMISTopicCategory;

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
      files: null as any,
      title: "",
      description: "",
      deleteDocumentIds: [],
    },
    validationSchema: yup.object().shape({
      files: fileValidation({
        maxSizeMB: 10,
        allowedExtensions: ["jpg", "jpeg", "png"],
      }),
      title: yup.string().required(l.msg_required_form),
      description: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      back();

      const payload = new FormData();
      if (values.files?.[0]) {
        payload.append("files", values.files[0]);
      }
      payload.append("title", values.title);
      payload.append("description", values.description);
      payload.append(
        "deletedDocumentIds",
        JSON.stringify(values.deleteDocumentIds)
      );

      const config = {
        url: `${BASE_ENDPOINT}/update/${resolvedData.id}`,
        method: "PATCH",
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
      files: [],
      title: resolvedData.title,
      description: resolvedData.description,
      deleteDocumentIds: [],
    });
  }, [resolvedData]);

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
                  label={"Cover"}
                  invalid={!!formik.errors.files}
                  errorText={formik.errors.files as string}
                >
                  <FileInput
                    dropzone
                    inputValue={formik.values.files}
                    onChange={(inputValue) => {
                      formik.setFieldValue("files", inputValue);
                    }}
                    existingFiles={resolvedData.categoryCover}
                    onDeleteFile={(fileData) => {
                      formik.setFieldValue(
                        "deleteDocumentIds",
                        Array.from(
                          new Set([
                            ...formik.values.deleteDocumentIds,
                            fileData.id,
                          ])
                        )
                      );
                    }}
                    onUndoDeleteFile={(fileData) => {
                      formik.setFieldValue(
                        "deleteDocumentIds",
                        formik.values.deleteDocumentIds.filter(
                          (id: string) => id !== fileData.id
                        )
                      );
                    }}
                  />
                </Field>

                <Field
                  label={l.title}
                  invalid={!!formik.errors.title}
                  errorText={formik.errors.title as string}
                >
                  <StringInput
                    inputValue={formik.values.title}
                    onChange={(inputValue) => {
                      formik.setFieldValue("title", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.description}
                  invalid={!!formik.errors.description}
                  errorText={formik.errors.description as string}
                >
                  <Textarea
                    inputValue={formik.values.description}
                    onChange={(inputValue) => {
                      formik.setFieldValue("description", inputValue);
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
      description={l.msg_soft_delete}
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
      description={l.msg_soft_delete}
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

const ToggleDataDisplay = (props: any) => {
  // Props
  const { displayTable, setDisplayTable, ...restProps } = props;

  // Hooks
  const iss = useIsSmScreenWidth();

  return (
    <Btn
      iconButton={iss ? true : false}
      size={"md"}
      w={iss ? "" : "100px"}
      variant={"outline"}
      onClick={() => setDisplayTable((ps: boolean) => !ps)}
      {...restProps}
    >
      <Icon>
        {displayTable ? (
          <IconTable stroke={1.5} />
        ) : (
          <IconLayoutGrid stroke={1.5} />
        )}
      </Icon>

      {iss ? "" : displayTable ? "Table" : "Grid"}
    </Btn>
  );
};
const DataUtils = (props: any) => {
  // Props
  const { filter, setFilter, displayTable, setDisplayTable, ...restProps } =
    props;

  return (
    <HStack p={3} {...restProps}>
      <SearchInput
        inputValue={filter.search}
        onChange={(inputValue) => {
          setFilter({ ...filter, search: inputValue });
        }}
      />

      <ToggleDataDisplay
        displayTable={displayTable}
        setDisplayTable={setDisplayTable}
      />
    </HStack>
  );
};
const Data = (props: any) => {
  // Props
  const { filter, displayTable, routeTitle } = props;

  // Contexts
  const { l } = useLang();

  // States
  // const initialLoading = true;
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
        th: l.educator,
        sortable: true,
      },
      {
        th: l.account_status,
        sortable: true,
      },
      {
        th: l.private_navs.kmis.topic,
        sortable: true,
        align: "center",
      },
      {
        th: l.finished_topic,
        sortable: true,
        align: "center",
      },
      {
        th: l.avg_kmis_score,
        sortable: true,
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
        th: l.deactive,
        sortable: true,
      },
    ],
    rows: data?.map((item, idx) => ({
      id: item.id,
      idx: idx,
      data: item,
      columns: [
        {
          td: <MiniUser user={item.user} />,
          value: item.user.name,
        },
        {
          td: <AccountStatus accountStatusId={item.user.accountStatus} />,
          value: item.user.accountStatus,
          align: "center",
          dataType: "number",
        },
        {
          td: formatNumber(item.totalTopic),
          value: item.totalTopic,
          align: "center",
          dataType: "number",
        },
        {
          td: formatNumber(item.totalFinished),
          value: item.totalFinished,
          align: "center",
          dataType: "number",
        },
        {
          td: formatNumber(item.avgScoreFinished),
          value: item.avgScoreFinished,
          align: "center",
          dataType: "number",
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
          td: <DeletedStatus deletedAt={item.user.deactiveAt} />,
          value: item.user.deactiveAt,
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
            disabled={!row.data.user.deactiveAt}
            routeTitle={routeTitle}
          />
        ),
      }),
      (row) => ({
        override: (
          <Deactivate
            deactivateAccountIds={[row.data.id]}
            disabled={row.data.user.deactiveAt}
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
                .some((item) => !item.user.deactiveAt)
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
                .some((item) => item.user.deactiveAt)
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
        routeTitle={routeTitle}
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
  const [displayTable, setDisplayTable] = useState<boolean>(true);

  return (
    <PageContainer>
      <PageContent>
        <DataUtils
          filter={filter}
          setFilter={setFilter}
          displayTable={displayTable}
          setDisplayTable={setDisplayTable}
          routeTitle={routeTitle}
        />
        <Data
          filter={filter}
          displayTable={displayTable}
          routeTitle={routeTitle}
        />
      </PageContent>
    </PageContainer>
  );
}
