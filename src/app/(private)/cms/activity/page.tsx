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
import { Img } from "@/components/ui/img";
import { ImgInput } from "@/components/ui/img-input";
import { MenuItem } from "@/components/ui/menu";
import { RichEditor } from "@/components/ui/RichEditor";
import SearchInput from "@/components/ui/search-input";
import { StringInput } from "@/components/ui/string-input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import { ClampText } from "@/components/widget/ClampText";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { CreateCMSActivityCategoryDisclosureTrigger } from "@/components/widget/CreateCMSActivityCategoryDisclosure";
import { DataDisplayToggle } from "@/components/widget/DataDisplayToggle";
import { DataGrid } from "@/components/widget/DataGrid";
import { DataGridItem } from "@/components/widget/DataGridItem";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ImgViewer } from "@/components/widget/ImgViewer";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { SelectCMSActivityCategory } from "@/components/widget/SelectCMSActivityCategory";
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import {
  Interface__BatchOptionsTableOptionGenerator,
  Interface__CMSActivity,
  Interface__DataProps,
  Interface__RowOptionsTableOptionGenerator,
  Interface__SelectOption,
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
import { getActiveNavs, imgUrl } from "@/utils/url";
import { fileValidation, min1FileExist } from "@/utils/validationSchema";
import {
  FieldsetRoot,
  HStack,
  Icon,
  InputGroup,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconPencilMinus,
  IconPlus,
  IconRestore,
  IconTrash,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";

const BASE_ENDPOINT = "/api/cms/event";
const PREFIX_ID = "cms_activity";
type Interface__Data = Interface__CMSActivity;

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
      title: capitalize(`${l.add}${routeTitle} ${l.successful}`),
    },
  });

  // States
  const [maximize, setMaximize] = useState<boolean>(false);
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      category: null as Interface__SelectOption[] | null,
      files: null as any,
      titleId: "",
      titleEn: "",
      descriptionId: "",
      descriptionEn: "",
      eventContentId: "",
      eventContentEn: "",
    },
    validationSchema: yup.object().shape({
      category: yup.array().required(l.msg_required_form),
      files: fileValidation({
        maxSizeMB: 10,
        allowedExtensions: ["jpg", "jpeg", "png"],
      }).required(l.msg_required_form),
      titleId: yup.string().required(l.msg_required_form),
      titleEn: yup.string().required(l.msg_required_form),
      descriptionId: yup.string().required(l.msg_required_form),
      descriptionEn: yup.string().required(l.msg_required_form),
      eventContentId: yup.string().required(l.msg_required_form),
      eventContentEn: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      const payload = new FormData();
      payload.append("categoryId", `${values.category?.[0]?.id}`);
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
      payload.append(
        "eventContent",
        JSON.stringify({
          id: values.eventContentId,
          en: values.eventContentEn,
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

      <DisclosureRoot open={open} lazyLoad size={maximize ? "full" : "xl"}>
        <DisclosureContent
          positionerProps={{
            p: maximize ? 0 : 4,
          }}
        >
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={`${l.add} ${routeTitle}`}
              withMaximizeButton
              onMaximizeChange={(maximize) => {
                setMaximize(maximize);
              }}
            />
          </DisclosureHeader>

          <DisclosureBody>
            <form id={ID} onSubmit={formik.handleSubmit}>
              <FieldsetRoot disabled={loading}>
                <SimpleGrid columns={[1, null, 2]} gap={4}>
                  <CContainer gap={4}>
                    <Field
                      label={l.category}
                      invalid={!!formik.errors.category}
                      errorText={formik.errors.category as string}
                    >
                      <HStack w={"full"}>
                        <SelectCMSActivityCategory
                          inputValue={formik.values.category}
                          onConfirm={(inputValue) => {
                            formik.setFieldValue("category", inputValue);
                          }}
                          flex={1}
                        />

                        <CreateCMSActivityCategoryDisclosureTrigger>
                          <Btn iconButton variant={"outline"}>
                            <Icon>
                              <IconPlus stroke={1.5} />
                            </Icon>
                          </Btn>
                        </CreateCMSActivityCategoryDisclosureTrigger>
                      </HStack>
                    </Field>

                    <Field
                      label={"Thumbnail"}
                      invalid={!!formik.errors.files}
                      errorText={formik.errors.files as string}
                    >
                      <ImgInput
                        inputValue={formik.values.files}
                        onChange={(inputValue) => {
                          formik.setFieldValue("files", inputValue);
                        }}
                      />
                    </Field>
                  </CContainer>

                  <CContainer gap={4}>
                    <Field
                      label={l.title}
                      invalid={
                        !!(formik.errors.titleId || formik.errors.titleEn)
                      }
                      errorText={
                        (formik.errors.titleId ||
                          formik.errors.titleEn) as string
                      }
                    >
                      <InputGroup
                        startElement="id"
                        startElementProps={{
                          fontSize: "md",
                          fontWeight: "medium",
                        }}
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
                        startElementProps={{
                          fontSize: "md",
                          fontWeight: "medium",
                        }}
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
                          formik.errors.descriptionId ||
                          formik.errors.descriptionEn
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
                          minH={"100px"}
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
                          minH={"100px"}
                        />
                      </InputGroup>
                    </Field>
                  </CContainer>
                </SimpleGrid>

                <Field
                  label={`${l.content} (id)`}
                  invalid={!!formik.errors.eventContentId}
                  errorText={formik.errors.eventContentId as string}
                >
                  <RichEditor
                    inputValue={formik.values.eventContentId}
                    onChange={(inputValue) => {
                      formik.setFieldValue("eventContentId", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={`${l.content} (en)`}
                  invalid={!!formik.errors.eventContentEn}
                  errorText={formik.errors.eventContentEn as string}
                >
                  <RichEditor
                    inputValue={formik.values.eventContentEn}
                    onChange={(inputValue) => {
                      formik.setFieldValue("eventContentEn", inputValue);
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

const Update = (props: any) => {
  const ID = `${PREFIX_ID}_update`;

  // Props
  const { data, routeTitle } = props;
  const resolvedData = data as Interface__Data;

  // Contexts
  const { l, lang } = useLang();
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
  const [maximize, setMaximize] = useState<boolean>(false);
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      category: null as Interface__SelectOption[] | null,
      files: null as any,
      deleteDocumentIds: [],
      titleId: "",
      titleEn: "",
      descriptionId: "",
      descriptionEn: "",
      contentId: "",
      contentEn: "",
    },
    validationSchema: yup.object().shape({
      category: yup.array().required(l.msg_required_form),
      files: fileValidation({
        allowedExtensions: ["jpg", "jpeg", "png"],
      }).concat(
        min1FileExist({
          resolvedData,
          existingKey: "thumbnail",
          deletedKey: "deleteDocumentIds",
          newKey: "files",
          message: l.msg_required_form,
        })
      ),
      titleId: yup.string().required(l.msg_required_form),
      titleEn: yup.string().required(l.msg_required_form),
      descriptionId: yup.string().required(l.msg_required_form),
      descriptionEn: yup.string().required(l.msg_required_form),
      contentId: yup.string().required(l.msg_required_form),
      contentEn: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      const payload = new FormData();
      payload.append("categoryId", `${values.category?.[0]?.id}`);
      if (!isEmptyArray(values.files)) payload.append("files", values.files[0]);
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
      payload.append(
        "eventContent",
        JSON.stringify({
          id: values.contentId,
          en: values.contentEn,
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
      category: [
        {
          id: resolvedData.eventCategory.id,
          label: resolvedData.eventCategory.name[lang],
        },
      ],
      files: [],
      deleteDocumentIds: [],
      titleId: resolvedData.title.id,
      titleEn: resolvedData.title.en,
      descriptionId: resolvedData.description.id,
      descriptionEn: resolvedData.description.en,
      contentId: resolvedData.eventContent.id,
      contentEn: resolvedData.eventContent.en,
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

      <DisclosureRoot open={open} lazyLoad size={maximize ? "full" : "xl"}>
        <DisclosureContent
          positionerProps={{
            p: maximize ? 0 : 4,
          }}
        >
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={`Edit ${routeTitle}`}
              withMaximizeButton
              onMaximizeChange={(maximize) => {
                setMaximize(maximize);
              }}
            />
          </DisclosureHeader>

          <DisclosureBody>
            <form id={ID} onSubmit={formik.handleSubmit}>
              <FieldsetRoot disabled={loading}>
                <SimpleGrid columns={[1, null, 2]} gap={4}>
                  <CContainer gap={4}>
                    <Field
                      label={l.category}
                      invalid={!!formik.errors.category}
                      errorText={formik.errors.category as string}
                    >
                      <SelectCMSActivityCategory
                        inputValue={formik.values.category}
                        onChange={(inputValue) => {
                          formik.setFieldValue("category", inputValue);
                        }}
                      />
                    </Field>

                    <Field
                      label={"Thumbnail"}
                      invalid={!!formik.errors.files}
                      errorText={formik.errors.files as string}
                    >
                      <ImgInput
                        inputValue={formik.values.files}
                        onChange={(inputValue) => {
                          formik.setFieldValue("files", inputValue);
                        }}
                        existingFiles={resolvedData.thumbnail}
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
                  </CContainer>

                  <CContainer gap={4}>
                    <Field
                      label={l.title}
                      invalid={
                        !!(formik.errors.titleId || formik.errors.titleEn)
                      }
                      errorText={
                        (formik.errors.titleId ||
                          formik.errors.titleEn) as string
                      }
                    >
                      <InputGroup
                        startElement="id"
                        startElementProps={{
                          fontSize: "md",
                          fontWeight: "medium",
                        }}
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
                        startElementProps={{
                          fontSize: "md",
                          fontWeight: "medium",
                        }}
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
                          formik.errors.descriptionId ||
                          formik.errors.descriptionEn
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
                          minH={"100px"}
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
                          minH={"100px"}
                        />
                      </InputGroup>
                    </Field>
                  </CContainer>
                </SimpleGrid>

                <Field
                  label={`${l.content} (id)`}
                  invalid={!!formik.errors.contentId}
                  errorText={formik.errors.contentId as string}
                >
                  <RichEditor
                    inputValue={formik.values.contentId}
                    onChange={(inputValue) => {
                      formik.setFieldValue("contentId", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={`${l.content} (en)`}
                  invalid={!!formik.errors.contentEn}
                  errorText={formik.errors.contentEn as string}
                >
                  <RichEditor
                    inputValue={formik.values.contentEn}
                    onChange={(inputValue) => {
                      formik.setFieldValue("contentEn", inputValue);
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
        th: "Thumbnail",
        align: "center",
      },
      {
        th: l.title,
        sortable: true,
      },
      {
        th: l.description,
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
          td: (
            <ImgViewer
              id={`topic-cover-${item.id}`}
              src={imgUrl(item?.thumbnail?.[0]?.filePath)}
            >
              <Img
                key={imgUrl(item?.thumbnail?.[0]?.filePath)}
                src={imgUrl(item?.thumbnail?.[0]?.filePath)}
                h={"24px"}
                aspectRatio={1.1}
              />
            </ImgViewer>
          ),
          value: imgUrl(item?.thumbnail?.[0]?.filePath),
          dataType: "image",
          align: "center",
        },
        {
          td: <ClampText>{`${item.title[lang]}`}</ClampText>,
          value: item.title[lang],
        },
        {
          td: <ClampText>{`${item.description[lang]}`}</ClampText>,
          value: item.description[lang],
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
                showImg: true,
                img: imgUrl(resolvedItem?.thumbnail?.[0]?.filePath),
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
