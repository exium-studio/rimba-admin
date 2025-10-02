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
import { Img } from "@/components/ui/img";
import { MenuItem } from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { StringInput } from "@/components/ui/string-input";
import { Textarea } from "@/components/ui/textarea";
import { ClampText } from "@/components/widget/ClampText";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { DataGridDetailDisclosureTrigger } from "@/components/widget/DataGridDetailDisclosure";
import { DataTable } from "@/components/widget/DataTable";
import { DeletedStatus } from "@/components/widget/DeletedStatus";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ImgViewer } from "@/components/widget/ImgViewer";
import { DotIndicator } from "@/components/widget/Indicator";
import { Limitation } from "@/components/widget/Limitation";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { Pagination } from "@/components/widget/Pagination";
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import {
  Interface__BatchOptionsTableOptionGenerator,
  Interface__KMISCourseCategory,
  Interface__RowOptionsTableOptionGenerator,
} from "@/constants/interfaces";
import { SVGS_PATH } from "@/constants/paths";
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
import { fileValidation } from "@/utils/validationSchema";
import {
  FieldsetRoot,
  HStack,
  Icon,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconLayoutGrid,
  IconPencilMinus,
  IconPlus,
  IconRestore,
  IconTable,
  IconTrash,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";

const BASE_ENDPOINT = "/api/kmis/category";
const PREFIX_ID = "course_category";
type Interface__Data = Interface__KMISCourseCategory;

const Create = (props: any) => {
  const ID = `${PREFIX_ID}_create`;

  // Props
  const { disclosureTitle } = props;

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
      title: capitalize(`${l.add} ${disclosureTitle}`),
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { files: null as any, title: "", description: "" },
    validationSchema: yup.object().shape({
      files: fileValidation({
        maxSizeMB: 10,
        allowedExtensions: ["jpg", "jpeg", "png"],
      }).required(l.msg_required_form),
      title: yup.string().required(l.msg_required_form),
      description: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      back();

      const payload = new FormData();
      payload.append("files", values.files[0]);
      payload.append("title", values.title);
      payload.append("description", values.description);

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
            <DisclosureHeaderContent title={`${l.add} ${disclosureTitle}`} />
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
  const { data, disclosureTitle } = props;
  const resolvedData = data as Interface__KMISCourseCategory;

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
      title: capitalize(`Edit ${disclosureTitle}`),
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
            <DisclosureHeaderContent title={`Edit ${disclosureTitle}`} />
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
const Restore = (props: any) => {
  const ID = `${PREFIX_ID}_restore`;

  // Props
  const { restoreIds, clearSelectedRows, disabled, disclosureTitle } = props;

  // Contexts
  const { l } = useLang();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`Restore ${disclosureTitle}`),
    },
  });

  // Utils
  function onDelete() {
    back();
    req({
      config: {
        url: `${BASE_ENDPOINT}/restore`,
        method: "PATCH",
        data: {
          restoreIds: restoreIds,
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
      id={`${ID}-${restoreIds}`}
      title={`Restore ${disclosureTitle}`}
      description={l.msg_soft_delete}
      confirmLabel={"Restore"}
      onConfirm={onDelete}
      loading={loading}
      disabled={disabled}
    >
      <MenuItem value="restore" disabled={disabled}>
        Restore
        <Icon boxSize={"18px"} ml={"auto"}>
          <IconRestore stroke={1.5} />
        </Icon>
      </MenuItem>
    </ConfirmationDisclosureTrigger>
  );
};
const Delete = (props: any) => {
  const ID = `${PREFIX_ID}_delete`;

  // Props
  const { deleteIds, clearSelectedRows, disabled, disclosureTitle } = props;

  // Contexts
  const { l } = useLang();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`Delete ${disclosureTitle}`),
    },
  });

  // Utils
  function onDelete() {
    back();
    req({
      config: {
        url: `${BASE_ENDPOINT}/delete`,
        method: "DELETE",
        data: {
          deleteIds: deleteIds,
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
      id={`${ID}-${deleteIds}`}
      title={`Delete ${disclosureTitle}`}
      description={l.msg_soft_delete}
      confirmLabel={"Delete"}
      onConfirm={onDelete}
      confirmButtonProps={{
        color: "fg.error",
        colorPalette: "gray",
        variant: "outline",
      }}
      loading={loading}
      disabled={disabled}
    >
      <MenuItem value="delete" color={"fg.error"} disabled={disabled}>
        Delete
        <Icon boxSize={"18px"} ml={"auto"}>
          <IconTrash stroke={1.5} />
        </Icon>
      </MenuItem>
    </ConfirmationDisclosureTrigger>
  );
};

const DataGrid = (props: any) => {
  // Props
  const {
    data,
    limit,
    setLimit,
    page,
    setPage,
    totalPage,
    footer,
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const iss = useIsSmScreenWidth();

  // States
  const hasFooter = limit && setLimit && page && setPage;

  return (
    <>
      <CContainer className="scrollY" flex={1} p={4} {...restProps}>
        <SimpleGrid columns={[1, null, 2, 3, 4, 5]} gap={4}>
          {data.map((item: Interface__Data) => {
            const details = [
              {
                label: "ID",
                render: <P>{item.id}</P>,
              },
              {
                label: "Cover",
                render: (
                  <ImgViewer
                    src={imgUrl(item.categoryCover?.[0]?.filePath)}
                    w={"full"}
                  >
                    <Img
                      src={imgUrl(item.categoryCover?.[0]?.filePath)}
                      fallbackSrc={`${SVGS_PATH}/no-avatar.svg`}
                      fluid
                    />
                  </ImgViewer>
                ),
              },
              {
                label: l.title,
                render: <P>{item.title}</P>,
              },
              {
                label: l.description,
                render: <P>{item.description}</P>,
              },
              {
                label: l.added,
                render: (
                  <P>
                    {formatDate(item.createdAt, {
                      variant: "numeric",
                      withTime: true,
                      dashEmpty: true,
                    })}
                  </P>
                ),
              },
              {
                label: l.updated,
                render: (
                  <P>
                    {formatDate(item.updatedAt, {
                      variant: "numeric",
                      withTime: true,
                      dashEmpty: true,
                    })}
                  </P>
                ),
              },
              {
                label: l.deleted,
                render: <DeletedStatus deletedAt={item.deletedAt} />,
              },
            ];

            return (
              <DataGridDetailDisclosureTrigger
                key={item.id}
                className="lg-clicky"
                id={`${item.id}`}
                title={item.title}
                data={item}
                details={details}
                w={"full"}
                cursor={"pointer"}
                _hover={{
                  bg: "d1",
                }}
              >
                <CContainer
                  key={item.id}
                  flex={1}
                  border={"1px solid"}
                  borderColor={"border.muted"}
                  rounded={themeConfig.radii.component}
                  overflow={"clip"}
                >
                  <Img
                    src={imgUrl(item.categoryCover?.[0]?.filePath)}
                    aspectRatio={1}
                    rounded={themeConfig.radii.component}
                    fallbackSrc={`${SVGS_PATH}/no-avatar.svg`}
                  />

                  <CContainer flex={1} gap={1} px={3} my={3}>
                    <HStack>
                      <P fontWeight={"semibold"} lineClamp={1}>
                        {item.title}
                      </P>

                      {item.deletedAt && (
                        <DotIndicator color={"fg.error"} ml={"auto"} mr={1} />
                      )}
                    </HStack>

                    <P color={"fg.subtle"} lineClamp={2}>
                      {item.description}
                    </P>
                  </CContainer>
                </CContainer>
              </DataGridDetailDisclosureTrigger>
            );
          })}
        </SimpleGrid>
      </CContainer>

      {hasFooter && (
        <>
          <HStack
            p={3}
            borderTop={"1px solid"}
            borderColor={"border.muted"}
            justify={"space-between"}
          >
            <CContainer w={"fit"} mb={[1, null, 0]}>
              <Limitation limit={limit} setLimit={setLimit} />
            </CContainer>

            {!iss && (
              <CContainer
                w={"fit"}
                justify={"center"}
                pl={[2, null, 0]}
                mt={[footer ? 1 : 0, null, 0]}
              >
                {footer}
              </CContainer>
            )}

            <CContainer w={"fit"}>
              <Pagination page={page} setPage={setPage} totalPage={totalPage} />
            </CContainer>
          </HStack>

          {iss && (
            <CContainer
              w={"fit"}
              justify={"center"}
              pl={[2, null, 0]}
              mt={[footer ? 1 : 0, null, 0]}
            >
              {footer}
            </CContainer>
          )}
        </>
      )}
    </>
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
  const {
    filter,
    setFilter,
    displayTable,
    setDisplayTable,
    disclosureTitle,
    ...restProps
  } = props;

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

      <Create disclosureTitle={disclosureTitle} />
    </HStack>
  );
};
const Data = (props: any) => {
  // Props
  const { filter, displayTable, disclosureTitle } = props;

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
  const tableProps = {
    headers: [
      {
        th: "Cover",
        wrapperProps: {
          justify: "center",
        },
      },
      {
        th: l.title,
        sortable: true,
      },
      {
        th: l.description,
        sortable: true,
      },
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
      columns: [
        {
          td: (
            <ImgViewer src={imgUrl(item.categoryCover?.[0]?.filePath)}>
              <Img
                h={"24px"}
                aspectRatio={16 / 10}
                src={imgUrl(item.categoryCover?.[0]?.filePath)}
              />
            </ImgViewer>
          ),
          value: item.title,
        },
        {
          td: <ClampText>{item.title}</ClampText>,
          value: item.title,
        },
        {
          td: <ClampText>{item.description}</ClampText>,
          value: item.description,
        },
        {
          td: formatDate(item.createdAt, {
            variant: "numeric",
            withTime: true,
            dashEmpty: true,
          }),
          value: item.createdAt,
          dataType: "date",
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
          td: <DeletedStatus deletedAt={item.deletedAt} />,
          value: item.deletedAt,
          dataType: "date",
        },
      ],
    })),
    rowOptions: [
      (row) => ({
        override: <Update data={row.data} disclosureTitle={disclosureTitle} />,
      }),
      (row) => ({
        override: (
          <Restore
            restoreIds={[row.data.id]}
            disabled={!row.data.deletedAt}
            disclosureTitle={disclosureTitle}
          />
        ),
      }),
      (row) => ({
        override: (
          <Delete
            deleteIds={[row.data.id]}
            disabled={row.data.deletedAt}
            disclosureTitle={disclosureTitle}
          />
        ),
      }),
    ] as Interface__RowOptionsTableOptionGenerator<Interface__Data>[],
    batchOptions: [
      (ids, { clearSelectedRows }) => ({
        override: (
          <Restore
            restoreIds={ids}
            clearSelectedRows={clearSelectedRows}
            disabled={
              isEmptyArray(ids) ||
              data
                ?.filter((item) => ids.includes(item.id))
                .some((item) => !item.deletedAt)
            }
            disclosureTitle={disclosureTitle}
          />
        ),
      }),
      (ids, { clearSelectedRows }) => ({
        override: (
          <Delete
            deleteIds={ids}
            clearSelectedRows={clearSelectedRows}
            disabled={
              isEmptyArray(ids) ||
              data
                ?.filter((item) => ids.includes(item.id))
                .some((item) => item.deletedAt)
            }
            disclosureTitle={disclosureTitle}
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
        headers={tableProps.headers}
        rows={tableProps.rows}
        rowOptions={tableProps.rowOptions}
        batchOptions={tableProps.batchOptions}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPage={pagination?.meta?.last_page}
      />
    ) : (
      <DataGrid
        data={data}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPage={pagination?.meta?.last_page}
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

export default function KMISEducatorPage() {
  // Contexts
  const { l } = useLang();

  // States
  const pathname = usePathname();
  const activeNav = getActiveNavs(pathname);
  const disclosureTitle = pluckString(l, last(activeNav)!.labelKey);
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
          disclosureTitle={disclosureTitle}
        />
        <Data
          filter={filter}
          displayTable={displayTable}
          disclosureTitle={disclosureTitle}
        />
      </PageContent>
    </PageContainer>
  );
}
