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
import { MenuItem } from "@/components/ui/menu";
import SearchInput from "@/components/ui/search-input";
import { StringInput } from "@/components/ui/string-input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import BackButton from "@/components/widget/BackButton";
import { ClampText } from "@/components/widget/ClampText";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { DataDisplayToggle } from "@/components/widget/DataDisplayToggle";
import { DataGrid } from "@/components/widget/DataGrid";
import { DataGridItem } from "@/components/widget/DataGridItem";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { FileItem } from "@/components/widget/FIleItem";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import {
  Interface__BatchOptionsTableOptionGenerator,
  Interface__CMSLegalDocs,
  Interface__DataProps,
  Interface__RowOptionsTableOptionGenerator,
  Interface__StorageFile,
} from "@/constants/interfaces";
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
import { getActiveNavs } from "@/utils/url";
import { fileValidation, min1FileExist } from "@/utils/validationSchema";
import {
  FieldsetRoot,
  HStack,
  Icon,
  InputGroup,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconEye,
  IconPencilMinus,
  IconPlus,
  IconRestore,
  IconTrash,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";

const BASE_ENDPOINT = "/api/cms/legal-document";
const PREFIX_ID = "cms_legal-document";
type Interface__Data = Interface__CMSLegalDocs;

const MenuTooltip = (props: TooltipProps) => {
  // Props
  const { children, content, ...restProps } = props;
  return (
    <Tooltip
      content={content}
      positioning={{ placement: "right" }}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};

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
      files: null as any,
      titleId: "",
      titleEn: "",
      descriptionId: "",
      descriptionEn: "",
    },
    validationSchema: yup.object().shape({
      files: fileValidation({
        maxSizeMB: 10,
        allowedExtensions: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"],
      }).required(l.msg_required_form),
      titleId: yup.string().required(l.msg_required_form),
      titleEn: yup.string().required(l.msg_required_form),
      descriptionId: yup.string().required(l.msg_required_form),
      descriptionEn: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      const payload = new FormData();
      payload.append("files", values.files[0]);
      payload.append(
        "title",
        JSON.stringify({
          id: values.titleId,
          en: values.titleEn,
        })
      );
      payload.append(
        "description",
        JSON.stringify({
          id: values.descriptionId,
          en: values.descriptionEn,
        })
      );

      const config = {
        url: `${BASE_ENDPOINT}/create`,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            setRt((ps) => !ps);
            back();
          },
        },
      });
    },
  });

  return (
    <>
      <Tooltip content={`${l.add} data`}>
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
      </Tooltip>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${l.add} ${routeTitle}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <form id={ID} onSubmit={formik.handleSubmit}>
              <FieldsetRoot disabled={loading}>
                <Field
                  label={"Files"}
                  invalid={!!formik.errors.files}
                  errorText={formik.errors.files as string}
                >
                  <FileInput
                    dropzone
                    maxFiles={5}
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    acceptPlaceholder=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx"
                    inputValue={formik.values.files}
                    onChange={(inputValue) => {
                      formik.setFieldValue("files", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.title}
                  invalid={!!(formik.errors.titleId || formik.errors.titleEn)}
                  errorText={
                    (formik.errors.titleId || formik.errors.titleEn) as string
                  }
                >
                  <InputGroup
                    startElement="id"
                    startElementProps={{ fontSize: "md", fontWeight: "medium" }}
                  >
                    <StringInput
                      inputValue={formik.values.titleId}
                      onChange={(inputValue) => {
                        formik.setFieldValue("titleId", inputValue);
                      }}
                    />
                  </InputGroup>
                  <InputGroup
                    startElement="en"
                    startElementProps={{ fontSize: "md", fontWeight: "medium" }}
                  >
                    <StringInput
                      inputValue={formik.values.titleEn}
                      onChange={(inputValue) => {
                        formik.setFieldValue("titleEn", inputValue);
                      }}
                    />
                  </InputGroup>
                </Field>

                <Field
                  label={l.description}
                  invalid={
                    !!(
                      formik.errors.descriptionId || formik.errors.descriptionEn
                    )
                  }
                  errorText={
                    (formik.errors.descriptionId ||
                      formik.errors.descriptionEn) as string
                  }
                >
                  <InputGroup
                    startElement="id"
                    display={"flex"}
                    startElementProps={{
                      fontSize: "md",
                      fontWeight: "medium",
                      alignItems: "start !important",
                      mt: "18px",
                    }}
                  >
                    <Textarea
                      inputValue={formik.values.descriptionId}
                      onChange={(inputValue) => {
                        formik.setFieldValue("descriptionId", inputValue);
                      }}
                      pl={"40px !important"}
                    />
                  </InputGroup>
                  <InputGroup
                    startElement="en"
                    display={"flex"}
                    startElementProps={{
                      fontSize: "md",
                      fontWeight: "medium",
                      alignItems: "start !important",
                      mt: "18px",
                    }}
                  >
                    <Textarea
                      inputValue={formik.values.descriptionEn}
                      onChange={(inputValue) => {
                        formik.setFieldValue("descriptionEn", inputValue);
                      }}
                      pl={"40px !important"}
                    />
                  </InputGroup>
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

const FilesList = (props: any) => {
  // Props
  const { data, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`legal-docs-list-${data.id}`, open, onOpen, onClose);

  return (
    <>
      <Btn
        size={"xs"}
        variant={"ghost"}
        pl={"6px"}
        onClick={onOpen}
        {...restProps}
      >
        <Icon boxSize={5}>
          <IconEye stroke={1.5} />
        </Icon>

        {l.view}
      </Btn>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={l.private_navs.cms.legal_document}
            />
          </DisclosureHeader>

          <DisclosureBody>
            <CContainer gap={4}>
              {data?.document?.map((doc: Interface__StorageFile) => {
                return <FileItem key={doc.id} fileData={doc} />;
              })}
            </CContainer>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
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
      files: null as any,
      titleId: "",
      titleEn: "",
      descriptionId: "",
      descriptionEn: "",
      deleteDocumentIds: [],
    },
    validationSchema: yup.object().shape({
      files: fileValidation({
        allowedExtensions: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"],
      }).concat(
        min1FileExist({
          resolvedData,
          existingKey: "document",
          deletedKey: "deleteDocumentIds",
          newKey: "files",
          message: l.msg_required_form,
        })
      ),
      titleId: yup.string().required(l.msg_required_form),
      titleEn: yup.string().required(l.msg_required_form),
      descriptionId: yup.string().required(l.msg_required_form),
      descriptionEn: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      const payload = new FormData();
      payload.append("files", values.files[0]);
      payload.append(
        "deleteDocumentIds",
        JSON.stringify(values.deleteDocumentIds)
      );
      payload.append(
        "title",
        JSON.stringify({
          id: values.titleId,
          en: values.titleEn,
        })
      );
      payload.append(
        "description",
        JSON.stringify({
          id: values.descriptionId,
          en: values.descriptionEn,
        })
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
            back();
          },
        },
      });
    },
  });

  useEffect(() => {
    formik.setValues({
      files: [],
      titleId: resolvedData.title.id,
      titleEn: resolvedData.title.en,
      descriptionId: resolvedData.description.id,
      descriptionEn: resolvedData.description.en,
      deleteDocumentIds: [],
    });
  }, [open, resolvedData]);

  return (
    <>
      <MenuTooltip content={"Edit"}>
        <MenuItem value="edit" onClick={onOpen}>
          Edit
          <Icon boxSize={"18px"} ml={"auto"}>
            <IconPencilMinus stroke={1.5} />
          </Icon>
        </MenuItem>
      </MenuTooltip>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`Edit ${routeTitle}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <form id={ID} onSubmit={formik.handleSubmit}>
              <FieldsetRoot disabled={loading}>
                <Field
                  label={"Files"}
                  invalid={!!formik.errors.files}
                  errorText={formik.errors.files as string}
                >
                  <FileInput
                    dropzone
                    maxFiles={5}
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    acceptPlaceholder=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx"
                    inputValue={formik.values.files}
                    onChange={(inputValue) => {
                      formik.setFieldValue("files", inputValue);
                    }}
                    existingFiles={resolvedData.document}
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
                  invalid={!!(formik.errors.titleId || formik.errors.titleEn)}
                  errorText={
                    (formik.errors.titleId || formik.errors.titleEn) as string
                  }
                >
                  <InputGroup
                    startElement="id"
                    startElementProps={{ fontSize: "md", fontWeight: "medium" }}
                  >
                    <StringInput
                      inputValue={formik.values.titleId}
                      onChange={(inputValue) => {
                        formik.setFieldValue("titleId", inputValue);
                      }}
                    />
                  </InputGroup>
                  <InputGroup
                    startElement="en"
                    startElementProps={{ fontSize: "md", fontWeight: "medium" }}
                  >
                    <StringInput
                      inputValue={formik.values.titleEn}
                      onChange={(inputValue) => {
                        formik.setFieldValue("titleEn", inputValue);
                      }}
                    />
                  </InputGroup>
                </Field>

                <Field
                  label={l.description}
                  invalid={
                    !!(
                      formik.errors.descriptionId || formik.errors.descriptionEn
                    )
                  }
                  errorText={
                    (formik.errors.descriptionId ||
                      formik.errors.descriptionEn) as string
                  }
                >
                  <InputGroup
                    startElement="id"
                    display={"flex"}
                    startElementProps={{
                      fontSize: "md",
                      fontWeight: "medium",
                      alignItems: "start !important",
                      mt: "18px",
                    }}
                  >
                    <Textarea
                      inputValue={formik.values.descriptionId}
                      onChange={(inputValue) => {
                        formik.setFieldValue("descriptionId", inputValue);
                      }}
                      pl={"40px !important"}
                    />
                  </InputGroup>
                  <InputGroup
                    startElement="en"
                    display={"flex"}
                    startElementProps={{
                      fontSize: "md",
                      fontWeight: "medium",
                      alignItems: "start !important",
                      mt: "18px",
                    }}
                  >
                    <Textarea
                      inputValue={formik.values.descriptionEn}
                      onChange={(inputValue) => {
                        formik.setFieldValue("descriptionEn", inputValue);
                      }}
                      pl={"40px !important"}
                    />
                  </InputGroup>
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
  const { restoreIds, clearSelectedRows, disabled, routeTitle } = props;

  // Contexts
  const { l } = useLang();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${l.restore} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${l.restore} ${routeTitle} ${l.successful}`),
    },
  });

  // Utils
  function onActivate() {
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
      title={`${l.restore} ${routeTitle}`}
      description={l.msg_restore}
      confirmLabel={`${l.restore}`}
      onConfirm={onActivate}
      loading={loading}
      disabled={disabled}
    >
      <MenuTooltip content={l.restore}>
        <MenuItem value="restore" disabled={disabled}>
          {l.restore}
          <Icon boxSize={"18px"} ml={"auto"}>
            <IconRestore stroke={1.5} />
          </Icon>
        </MenuItem>
      </MenuTooltip>
    </ConfirmationDisclosureTrigger>
  );
};
const Delete = (props: any) => {
  const ID = `${PREFIX_ID}_delete`;

  // Props
  const { deleteIds, clearSelectedRows, disabled, routeTitle } = props;

  // Contexts
  const { l } = useLang();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${l.delete_} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${l.delete_} ${routeTitle} ${l.successful}`),
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
      title={`${l.delete_} ${routeTitle}`}
      description={l.msg_soft_delete}
      confirmLabel={`${l.delete_}`}
      onConfirm={onDelete}
      confirmButtonProps={{
        color: "fg.error",
        colorPalette: "gray",
        variant: "outline",
      }}
      loading={loading}
      disabled={disabled}
    >
      <MenuTooltip content={l.delete_}>
        <MenuItem value="delete" color={"fg.error"} disabled={disabled}>
          {l.delete_}
          <Icon boxSize={"18px"} ml={"auto"}>
            <IconTrash stroke={1.5} />
          </Icon>
        </MenuItem>
      </MenuTooltip>
    </ConfirmationDisclosureTrigger>
  );
};

const Data = (props: any) => {
  // Props
  const { filter, routeTitle } = props;

  // Contexts
  const { l, lang } = useLang();
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
        th: l.title,
        sortable: true,
      },
      {
        th: l.description,
        sortable: true,
      },
      {
        th: "Files",
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
          td: <ClampText>{`${item.title[lang]}`}</ClampText>,
          value: item.title[lang],
        },
        {
          td: <ClampText>{`${item.description[lang]}`}</ClampText>,
          value: item.description[lang],
        },
        {
          td: <FilesList data={item} />,
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
    rowOptions: [
      (row) => ({
        override: <Update data={row.data} routeTitle={routeTitle} />,
      }),
      (row) => ({
        override: (
          <Restore
            restoreIds={[row.data.id]}
            disabled={!row.data.deletedAt}
            routeTitle={routeTitle}
          />
        ),
      }),
      (row) => ({
        override: (
          <Delete
            deleteIds={[row.data.id]}
            disabled={!!row.data.deletedAt}
            routeTitle={routeTitle}
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
            routeTitle={routeTitle}
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
                title: resolvedItem.title[lang],
                description: resolvedItem.description[lang],
                deletedAt: resolvedItem.deletedAt,
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
