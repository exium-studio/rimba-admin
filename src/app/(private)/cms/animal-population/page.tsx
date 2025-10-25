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
import { ImgInput } from "@/components/ui/img-input";
import { MenuItem } from "@/components/ui/menu";
import { NumInput } from "@/components/ui/number-input";
import SearchInput from "@/components/ui/search-input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import { ClampText } from "@/components/widget/ClampText";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { CreateCMSAnimalCategoryDisclosureTrigger } from "@/components/widget/CreateCMSAnimalCategoryDisclosure";
import { DataDisplayToggle } from "@/components/widget/DataDisplayToggle";
import { DataGrid } from "@/components/widget/DataGrid";
import { DataGridItem } from "@/components/widget/DataGridItem";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { SelectCMSAnimalCategory } from "@/components/widget/SelectCMSAnimalCategory";
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import {
  Interface__BatchOptionsTableOptionGenerator,
  Interface__CMSAnimalPopulation,
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
  IconPencilMinus,
  IconPlus,
  IconRestore,
  IconTrash,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";

const BASE_ENDPOINT = "/api/cms/animal-composition";
const PREFIX_ID = "cms_animal_population";
type Interface__Data = Interface__CMSAnimalPopulation;

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
      title: capitalize(`${l.add} ${routeTitle} ${l.successful}`),
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      files: null as any,
      category: null as Interface__SelectOption[] | null,
      nameId: "",
      nameEn: "",
      descriptionId: "",
      descriptionEn: "",
      total: null as number | null,
    },
    validationSchema: yup.object().shape({
      files: fileValidation({
        maxSizeMB: 10,
        allowedExtensions: ["jpg", "jpeg", "png"],
      }).required(l.msg_required_form),
      nameId: yup.string().required(l.msg_required_form),
      nameEn: yup.string().required(l.msg_required_form),
      descriptionId: yup.string().required(l.msg_required_form),
      descriptionEn: yup.string().required(l.msg_required_form),
      total: yup.number().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      const payload = new FormData();
      if (!isEmptyArray(values.files)) payload.append("files", values.files[0]);
      payload.append("categoryId", `${formik.values.category?.[0]?.id}`);
      payload.append(
        "name",
        JSON.stringify({
          id: values.nameId,
          en: values.nameEn,
        })
      );
      payload.append(
        "description",
        JSON.stringify({
          id: values.descriptionId,
          en: values.descriptionEn,
        })
      );
      payload.append("total", `${values.total}`);

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
                  label={l.animal_cateogry}
                  invalid={!!(formik.errors.nameId || formik.errors.nameEn)}
                  errorText={
                    (formik.errors.nameId || formik.errors.nameEn) as string
                  }
                >
                  <HStack w={"full"}>
                    <SelectCMSAnimalCategory
                      inputValue={formik.values.category}
                      onConfirm={(inputValue) => {
                        formik.setFieldValue("category", inputValue);
                      }}
                      flex={1}
                    />

                    <CreateCMSAnimalCategoryDisclosureTrigger>
                      <Btn iconButton variant={"outline"}>
                        <Icon>
                          <IconPlus stroke={1.5} />
                        </Icon>
                      </Btn>
                    </CreateCMSAnimalCategoryDisclosureTrigger>
                  </HStack>
                </Field>

                <Field
                  label={l.image}
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

                <Field
                  label={l.name}
                  invalid={!!(formik.errors.nameId || formik.errors.nameEn)}
                  errorText={
                    (formik.errors.nameId || formik.errors.nameEn) as string
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
                      inputValue={formik.values.nameId}
                      onChange={(inputValue) => {
                        formik.setFieldValue("nameId", inputValue);
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
                      inputValue={formik.values.nameEn}
                      onChange={(inputValue) => {
                        formik.setFieldValue("nameEn", inputValue);
                      }}
                      pl={"40px !important"}
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

                <Field
                  label={"Total"}
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
                  <NumInput
                    inputValue={formik.values.total}
                    onChange={(inputValue) => {
                      formik.setFieldValue("total", inputValue);
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
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      files: null as any,
      deleteDocumentIds: [],
      category: null as Interface__SelectOption[] | null,
      nameId: "",
      nameEn: "",
      descriptionId: "",
      descriptionEn: "",
      total: null as number | null,
    },
    validationSchema: yup.object().shape({
      files: fileValidation({
        maxSizeMB: 10,
        allowedExtensions: ["jpg", "jpeg", "png"],
      }).concat(
        min1FileExist({
          resolvedData,
          existingKey: "speciesImage",
          deletedKey: "deleteDocumentIds",
          newKey: "files",
          message: l.msg_required_form,
        })
      ),
      nameId: yup.string().required(l.msg_required_form),
      nameEn: yup.string().required(l.msg_required_form),
      descriptionId: yup.string().required(l.msg_required_form),
      descriptionEn: yup.string().required(l.msg_required_form),
      total: yup.number().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      const payload = new FormData();
      if (!isEmptyArray(values.files)) payload.append("files", values.files[0]);
      payload.append("categoryId", `${formik.values.category?.[0]?.id}`);
      payload.append(
        "name",
        JSON.stringify({
          id: values.nameId,
          en: values.nameEn,
        })
      );
      payload.append(
        "description",
        JSON.stringify({
          id: values.descriptionId,
          en: values.descriptionEn,
        })
      );
      payload.append("total", `${values.total}`);

      const config = {
        url: `${BASE_ENDPOINT}/update/${`${resolvedData?.id}`}`,
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
      deleteDocumentIds: [],
      category: [
        {
          id: resolvedData.animalCategory.id,
          label: resolvedData.animalCategory.name[lang],
        },
      ],
      nameId: resolvedData.name.id,
      nameEn: resolvedData.name.en,
      descriptionId: resolvedData.description.id,
      descriptionEn: resolvedData.description.en,
      total: resolvedData.total,
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
                  label={l.animal_cateogry}
                  invalid={!!(formik.errors.nameId || formik.errors.nameEn)}
                  errorText={
                    (formik.errors.nameId || formik.errors.nameEn) as string
                  }
                >
                  <HStack w={"full"}>
                    <SelectCMSAnimalCategory
                      inputValue={formik.values.category}
                      onConfirm={(inputValue) => {
                        formik.setFieldValue("category", inputValue);
                      }}
                      flex={1}
                    />

                    <CreateCMSAnimalCategoryDisclosureTrigger>
                      <Btn iconButton variant={"outline"}>
                        <Icon>
                          <IconPlus stroke={1.5} />
                        </Icon>
                      </Btn>
                    </CreateCMSAnimalCategoryDisclosureTrigger>
                  </HStack>
                </Field>

                <Field
                  label={l.image}
                  invalid={!!formik.errors.files}
                  errorText={formik.errors.files as string}
                >
                  <ImgInput
                    inputValue={formik.values.files}
                    onChange={(inputValue) => {
                      formik.setFieldValue("files", inputValue);
                    }}
                    existingFiles={resolvedData.speciesImage}
                    onDeleteFile={(fileData) => {
                      formik.setFieldValue(
                        "files",
                        Array.from(
                          new Set([...formik.values.files, fileData.id])
                        )
                      );
                    }}
                    onUndoDeleteFile={(fileData) => {
                      formik.setFieldValue(
                        "files",
                        formik.values.files.filter(
                          (id: string) => id !== fileData.id
                        )
                      );
                    }}
                  />
                </Field>

                <Field
                  label={l.name}
                  invalid={!!(formik.errors.nameId || formik.errors.nameEn)}
                  errorText={
                    (formik.errors.nameId || formik.errors.nameEn) as string
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
                      inputValue={formik.values.nameId}
                      onChange={(inputValue) => {
                        formik.setFieldValue("nameId", inputValue);
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
                      inputValue={formik.values.nameEn}
                      onChange={(inputValue) => {
                        formik.setFieldValue("nameEn", inputValue);
                      }}
                      pl={"40px !important"}
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

                <Field
                  label={"Total"}
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
                  <NumInput
                    inputValue={formik.values.total}
                    onChange={(inputValue) => {
                      formik.setFieldValue("total", inputValue);
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
        th: l.question,
        sortable: true,
      },
      {
        th: l.answer,
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
          td: <ClampText>{`${item.name[lang]}`}</ClampText>,
          value: item.name[lang],
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
                title: resolvedItem.name[lang],
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
