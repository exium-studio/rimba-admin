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
import { Divider } from "@/components/ui/divider";
import { Field } from "@/components/ui/field";
import { Img } from "@/components/ui/img";
import { ImgInput } from "@/components/ui/img-input";
import { MenuItem } from "@/components/ui/menu";
import { NavLink } from "@/components/ui/nav-link";
import { NumInput } from "@/components/ui/number-input";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { StringInput } from "@/components/ui/string-input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import { ClampText } from "@/components/widget/ClampText";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { CreateKMISCategoryDisclosureTrigger } from "@/components/widget/CreateKMISCategoryDisclosure";
import { DataDisplayToggle } from "@/components/widget/DataDisplayToggle";
import { DataGrid } from "@/components/widget/DataGrid";
import { DataGridItem } from "@/components/widget/DataGridItem";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ImgViewer } from "@/components/widget/ImgViewer";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { SelectKMISCategory } from "@/components/widget/SelectKMISCategory";
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import {
  Interface__BatchOptionsTableOptionGenerator,
  Interface__DataProps,
  Interface__KMISMaterial,
  Interface__KMISTopic,
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
  Badge,
  FieldsetRoot,
  HStack,
  Icon,
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

const BASE_ENDPOINT = "/api/kmis/topic";
const PREFIX_ID = "kmis_topic";
type Interface__Data = Interface__KMISTopic;

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
      category: null as unknown as Interface__SelectOption[],
      title: "",
      description: "",
      quizDuration: null as unknown as number,
    },
    validationSchema: yup.object().shape({
      files: fileValidation({
        maxSizeMB: 10,
        allowedExtensions: ["jpg", "jpeg", "png"],
      }).required(l.msg_required_form),
      category: yup.array().required(l.msg_required_form),
      title: yup.string().required(l.msg_required_form),
      description: yup.string().required(l.msg_required_form),
      quizDuration: yup.number().required(l.msg_required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      back();

      const payload = new FormData();
      payload.append("files", values.files?.[0]);
      payload.append("categoryId", `${values.category?.[0]?.id}`);
      payload.append("title", values.title);
      payload.append("description", values.description);
      payload.append("totalQuiz", "0");
      payload.append("quizDuration", `${values.quizDuration * 60}`);

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
                  label={l.category}
                  invalid={!!formik.errors.category}
                  errorText={formik.errors.category as string}
                >
                  <HStack w={"full"}>
                    <SelectKMISCategory
                      inputValue={formik.values.category}
                      onConfirm={(inputValue) => {
                        formik.setFieldValue("category", inputValue);
                      }}
                      flex={1}
                    />

                    <CreateKMISCategoryDisclosureTrigger>
                      <Btn iconButton variant={"outline"}>
                        <Icon>
                          <IconPlus stroke={1.5} />
                        </Icon>
                      </Btn>
                    </CreateKMISCategoryDisclosureTrigger>
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

                <Field
                  label={`${l.quiz_duration} (${l.minute.toLowerCase()})`}
                  invalid={!!formik.errors.quizDuration}
                  errorText={formik.errors.quizDuration as string}
                >
                  <NumInput
                    inputValue={formik.values.quizDuration}
                    onChange={(inputValue) => {
                      formik.setFieldValue("quizDuration", inputValue);
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

const Material = (props: any) => {
  // Props
  const { data } = props;

  // Contexts
  const { l } = useLang();

  // States
  const topic = { id: data.id, label: data.title };
  const topicQuery = `?topic=${encodeURIComponent(JSON.stringify(topic))}`;
  const toUrl = `/kmis/material${topicQuery}`;

  return (
    <NavLink to={toUrl} w={"full"}>
      <MenuTooltip content={l.private_navs.kmis.material}>
        <MenuItem value="material">
          <P lineClamp={1}>{l.private_navs.kmis.material}</P>
        </MenuItem>
      </MenuTooltip>
    </NavLink>
  );
};
const Quiz = (props: any) => {
  // Props
  const { data } = props;

  // Contexts
  const { l } = useLang();

  // States
  const topic = { id: data.id, label: data.title };
  const topicQuery = `?topic=${encodeURIComponent(JSON.stringify(topic))}`;
  const toUrl = `/kmis/quiz${topicQuery}`;

  return (
    <>
      <NavLink to={toUrl} w={"full"}>
        <MenuTooltip content={l.private_navs.kmis.quiz}>
          <MenuItem value="quiz">
            <P lineClamp={1}>{l.private_navs.kmis.quiz}</P>
          </MenuItem>
        </MenuTooltip>
      </NavLink>
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
      category: null as unknown as Interface__SelectOption[],
      title: "",
      description: "",
      materialOrder: [] as Interface__KMISMaterial[] | undefined,
      totalQuiz: null as number | null,
      quizDuration: null as unknown as number,
      deleteDocumentIds: [],
    },
    validationSchema: yup.object().shape({
      files: fileValidation({
        maxSizeMB: 10,
        allowedExtensions: ["jpg", "jpeg", "png"],
      }).concat(
        min1FileExist({
          resolvedData,
          existingKey: "topicCover",
          deletedKey: "deleteDocumentIds",
          newKey: "files",
          message: l.msg_required_form,
        })
      ),
      category: yup.array().required(l.msg_required_form),
      title: yup.string().required(l.msg_required_form),
      description: yup.string().required(l.msg_required_form),
      quizDuration: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      back();

      const payload = new FormData();
      if (values.files?.[0]) {
        payload.append("files", values.files[0]);
      }
      payload.append(
        "deleteDocumentIds",
        JSON.stringify(values.deleteDocumentIds)
      );
      payload.append("categoryId", `${values.category?.[0]?.id}`);
      payload.append("title", values.title);
      payload.append("description", values.description);
      payload.append(
        "materialOrderIds",
        JSON.stringify(values.materialOrder?.map((m) => m.id))
      );
      payload.append("totalQuiz", `${values.totalQuiz}`);
      payload.append("quizDuration", `${values.quizDuration * 60}`);

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

  // Utils
  // function handleMove(index: number, direction: "up" | "down") {
  //   const items = formik.values.materialOrder
  //     ? [...formik.values.materialOrder]
  //     : [];

  //   if (items.length <= 1) return;

  //   const lastIndex = items.length - 1;
  //   const newIndex =
  //     direction === "up"
  //       ? index === 0
  //         ? lastIndex
  //         : index - 1
  //       : index === lastIndex
  //       ? 0
  //       : index + 1;

  //   // move element
  //   const [movedItem] = items.splice(index, 1);
  //   items.splice(newIndex, 0, movedItem);

  //   formik.setFieldValue("materialOrder", items);
  // }

  useEffect(() => {
    formik.setValues({
      files: [],
      category: [
        {
          id: resolvedData.category?.id,
          label: resolvedData.category?.title,
        },
      ],
      title: resolvedData.title,
      description: resolvedData.description,
      materialOrder: resolvedData.materialOrder,
      totalQuiz: resolvedData.totalQuiz,
      quizDuration: resolvedData.quizDuration / 60,
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
                  label={l.category}
                  invalid={!!formik.errors.category}
                  errorText={formik.errors.category as string}
                >
                  <HStack w={"full"}>
                    <SelectKMISCategory
                      inputValue={formik.values.category}
                      onConfirm={(inputValue) => {
                        formik.setFieldValue("category", inputValue);
                      }}
                      flex={1}
                    />

                    <CreateKMISCategoryDisclosureTrigger>
                      <Btn iconButton variant={"outline"}>
                        <Icon>
                          <IconPlus stroke={1.5} />
                        </Icon>
                      </Btn>
                    </CreateKMISCategoryDisclosureTrigger>
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
                    existingFiles={resolvedData.topicCover}
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

                {/* <Field
                  label={l.material_order}
                  invalid={!!formik.errors.materialOrder}
                  errorText={formik.errors.materialOrder as string}
                >
                  {isEmptyArray(formik.values.materialOrder) && <P>-</P>}

                  {formik.values.materialOrder?.map((m, idx) => {
                    return (
                      <HStack
                        key={m.id}
                        w={"full"}
                        gap={4}
                        py={2}
                        px={4}
                        pr={2}
                        border={"1px solid"}
                        borderColor={"border.muted"}
                        rounded={themeConfig.radii.component}
                      >
                        <P color={"fg.subtle"}>{`${idx + 1}`}</P>

                        <ClampText>{m.title}</ClampText>

                        <HStack ml={"auto"}>
                          <Btn
                            iconButton
                            size={"2xs"}
                            variant={"ghost"}
                            onClick={() => handleMove(idx, "down")}
                          >
                            <Icon boxSize={5}>
                              <IconArrowDown stroke={1.5} />
                            </Icon>
                          </Btn>

                          <Btn
                            iconButton
                            size={"2xs"}
                            variant={"ghost"}
                            onClick={() => handleMove(idx, "up")}
                          >
                            <Icon boxSize={5}>
                              <IconArrowUp stroke={1.5} />
                            </Icon>
                          </Btn>
                        </HStack>
                      </HStack>
                    );
                  })}
                </Field> */}

                <Field
                  label={`${l.quiz_duration} (${l.minute.toLowerCase()})`}
                  invalid={!!formik.errors.quizDuration}
                  errorText={formik.errors.quizDuration as string}
                >
                  <NumInput
                    inputValue={formik.values.quizDuration}
                    onChange={(inputValue) => {
                      formik.setFieldValue("quizDuration", inputValue);
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
  function onRestore() {
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
      onConfirm={onRestore}
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
      {
        th: l.category,
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
              src={imgUrl(item?.topicCover?.[0]?.filePath)}
            >
              <Img
                key={imgUrl(item?.topicCover?.[0]?.filePath)}
                src={imgUrl(item?.topicCover?.[0]?.filePath)}
                h={"24px"}
                aspectRatio={1.1}
              />
            </ImgViewer>
          ),
          value: imgUrl(item?.topicCover?.[0]?.filePath),
          dataType: "image",
          align: "center",
        },
        {
          td: <ClampText>{`${item.title}`}</ClampText>,
          value: item.title,
        },
        {
          td: <ClampText>{`${item.description}`}</ClampText>,
          value: item.description,
        },
        {
          td: <ClampText>{`${item.category.title}`}</ClampText>,
          value: item.category.title,
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

      (row) => ({
        override: (
          <>
            <Divider my={1} />

            <Material data={row.data} />
          </>
        ),
      }),
      (row) => ({
        override: <Quiz data={row.data} />,
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
                img: imgUrl(resolvedItem.topicCover?.[0]?.filePath),
                title: (
                  <HStack pos={"relative"}>
                    <ClampText w={"full"} fontWeight={"semibold"} lineClamp={1}>
                      {resolvedItem.title}
                    </ClampText>

                    <Badge
                      pos={"absolute"}
                      top={"-40px"}
                      left={-1}
                      lineClamp={1}
                      maxW={"100px"}
                    >
                      <ClampText w={"full"} fontSize={"xs"} mt={"1.5px"}>
                        {resolvedItem.category.title}
                      </ClampText>
                    </Badge>
                  </HStack>
                ),
                description: resolvedItem.description,
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
