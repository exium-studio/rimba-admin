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
import { ImgInput } from "@/components/ui/img-input";
import { MenuItem } from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import { RichEditor } from "@/components/ui/RichEditor";
import SearchInput from "@/components/ui/search-input";
import { StringInput } from "@/components/ui/string-input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import { ClampText } from "@/components/widget/ClampText";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { DataDisplayToggle } from "@/components/widget/DataDisplayToggle";
import { DataGrid } from "@/components/widget/DataGrid";
import { DataGridItem } from "@/components/widget/DataGridItem";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { SelectKMISMaterialType } from "@/components/widget/SelectKMISMaterialType";
import { SelectKMISTopic } from "@/components/widget/SelectKMISTopic";
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import {
  Interface__BatchOptionsTableOptionGenerator,
  Interface__DataProps,
  Interface__KMISMaterial,
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
import { fileValidation, min1File } from "@/utils/validationSchema";
import {
  Center,
  FieldsetRoot,
  HStack,
  Icon,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconActivity,
  IconPencilMinus,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";

const BASE_ENDPOINT = "/api/kmis/material";
const PREFIX_ID = "kmis_material";
type Interface__Data = Interface__KMISMaterial;

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
const MaterialFormByType = (props: any) => {
  // Props
  const { type, formik, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  if (!type) {
    return (
      <Center minH={"200px"}>
        <P color="fg.subtle">{l.msg_select_material_type_first}</P>
      </Center>
    );
  }

  const typeMap: Record<string, any> = {
    gambar: (
      <CContainer gap={4}>
        <Field
          label={"File"}
          invalid={!!formik.errors.materialFiles}
          errorText={formik.errors.materialFiles as string}
        >
          <ImgInput
            inputValue={formik.values.materialFiles}
            onChange={(inputValue) => {
              formik.setFieldValue("materialFiles", inputValue);
            }}
            maxFiles={5}
          />
        </Field>

        <Field
          label={l.description}
          invalid={!!formik.errors.description}
          errorText={formik.errors.description as string}
        >
          <RichEditor
            inputValue={formik.values.description}
            onChange={(inputValue) => {
              formik.setFieldValue("description", inputValue);
            }}
          />
        </Field>
      </CContainer>
    ),
    video: (
      <CContainer gap={4}>
        <Field
          label={"Video URL"}
          invalid={!!formik.errors.description}
          errorText={formik.errors.description as string}
        >
          <Textarea
            inputValue={formik.values.materialUrl}
            onChange={(inputValue) => {
              formik.setFieldValue("materialUrl", inputValue);
            }}
          />
        </Field>

        <Field
          label={l.description}
          invalid={!!formik.errors.description}
          errorText={formik.errors.description as string}
        >
          <RichEditor
            inputValue={formik.values.description}
            onChange={(inputValue) => {
              formik.setFieldValue("description", inputValue);
            }}
          />
        </Field>
      </CContainer>
    ),
    dokumen: (
      <CContainer gap={4}>
        <Field
          label={"File"}
          invalid={!!formik.errors.materialFiles}
          errorText={formik.errors.materialFiles as string}
        >
          <FileInput
            dropzone
            maxFiles={5}
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            acceptPlaceholder=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx"
            inputValue={formik.values.materialFiles}
            onChange={(inputValue) => {
              formik.setFieldValue("materialFiles", inputValue);
            }}
          />
        </Field>

        <Field
          label={l.description}
          invalid={!!formik.errors.description}
          errorText={formik.errors.description as string}
        >
          <RichEditor
            inputValue={formik.values.description}
            onChange={(inputValue) => {
              formik.setFieldValue("description", inputValue);
            }}
          />
        </Field>
      </CContainer>
    ),
  };

  const forms = typeMap[type?.[0]?.id] ?? (
    <CContainer gap={4}>
      <Field
        label={l.private_navs.kmis.material}
        invalid={!!formik.errors.description}
        errorText={formik.errors.description as string}
      >
        <RichEditor
          inputValue={formik.values.description}
          onChange={(inputValue) => {
            formik.setFieldValue("description", inputValue);
          }}
        />
      </Field>
    </CContainer>
  );

  return <CContainer {...restProps}>{forms}</CContainer>;
};

const TopicFilter = (props: any) => {
  // Props
  const { filter, setFilter, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic");

  // States
  const initialTopic = topicParam ? JSON.parse(topicParam) : null;

  useEffect(() => {
    if (initialTopic) {
      setFilter({ ...filter, topic: [initialTopic] });
    }
  }, []);

  return (
    <SelectKMISTopic
      id="topic-filter-kmis-material"
      inputValue={filter.topic}
      onConfirm={(inputValue) => {
        setFilter({ ...filter, topic: inputValue });
      }}
      placeholder={l.private_navs.kmis.topic}
      {...restProps}
    />
  );
};
const Create = (props: any) => {
  const ID = `${PREFIX_ID}_create`;

  // Props
  const { routeTitle, filter } = props;

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
  const [maximize, setMaximize] = useState<boolean>(false);
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      topic: null as Interface__SelectOption[] | null,
      materialType: null as Interface__SelectOption[] | null,
      title: "",
      description: "",
      materialFiles: null as any,
      materialUrl: "",
    },
    validationSchema: yup.object().shape({
      topic: yup.array().required(l.msg_required_form),
      materialType: yup.array().required(l.msg_required_form),
      title: yup.string().required(l.msg_required_form),
      description: yup.string().required(l.msg_required_form),
      materialFiles: fileValidation().when("materialType", {
        is: (val: Interface__SelectOption[]) => val?.[0]?.id === "gambar",
        then: () =>
          fileValidation({
            allowedExtensions: ["png", "jpg", "jpeg"],
          }).required(l.msg_required_form),
        otherwise: () =>
          fileValidation({
            allowedExtensions: [
              "pdf",
              "doc",
              "docx",
              "xls",
              "xlsx",
              "ppt",
              "pptx",
            ],
          }).when("materialType", {
            is: (val: Interface__SelectOption[]) => val?.[0]?.id === "dokumen",
            then: (s) => s.required(l.msg_required_form),
            otherwise: (s) => s.notRequired(),
          }),
      }),
      materialUrl: yup.string().when("materialType", {
        is: (val: Interface__SelectOption[]) => val?.[0]?.id === "video",
        then: (schema) => schema.required(l.msg_required_form),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = new FormData();
      payload.append("topicId", `${values.topic?.[0]?.id}`);
      payload.append("materialType", values.materialType?.[0]?.id);
      payload.append("title", values.title);
      payload.append("description", values.description);
      payload.append("isPublic", `0`);
      // if (user?.id) {
      //   payload.append("uploadedBy", `${user.id}`);
      // }
      if (values.materialFiles?.[0]) {
        payload.append("materialFiles", values.materialFiles[0]);
      }
      if (values.materialUrl) {
        payload.append("materialUrl", values.materialUrl);
      }

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
            formik.setFieldValue("topic", filter.topic);
            back();
            setRt((ps) => !ps);
          },
        },
      });
    },
  });

  useEffect(() => {
    formik.setFieldValue("topic", filter.topic);
  }, [filter.topic]);

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
                <SimpleGrid columns={[1, null, 2]} gap={8}>
                  {/* basic form */}
                  <CContainer gap={4}>
                    <Field
                      label={l.private_navs.kmis.topic}
                      invalid={!!formik.errors.topic}
                      errorText={formik.errors.topic as string}
                    >
                      <SelectKMISTopic
                        inputValue={formik.values.topic}
                        onConfirm={(inputValue) => {
                          formik.setFieldValue("topic", inputValue);
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
                        onChange={(inputValue) =>
                          formik.setFieldValue("title", inputValue)
                        }
                      />
                    </Field>
                  </CContainer>

                  {/* material form */}
                  <CContainer gap={4}>
                    <Field
                      label={l.type}
                      invalid={!!formik.errors.materialType}
                      errorText={formik.errors.materialType as string}
                    >
                      <SelectKMISMaterialType
                        inputValue={formik.values.materialType}
                        onConfirm={(inputValue) => {
                          formik.setFieldValue("materialType", inputValue);
                        }}
                      />
                    </Field>

                    <Field label={l.publicity} disabled>
                      <HStack justify={"space-between"} w={"full"}>
                        <P opacity={0.4}>{l.msg_is_public_kmis_material}</P>
                        <Switch disabled />
                      </HStack>
                    </Field>
                  </CContainer>
                </SimpleGrid>

                <MaterialFormByType
                  type={formik.values.materialType}
                  formik={formik}
                />
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

      <TopicFilter filter={filter} setFilter={setFilter} w={"150px"} />

      <DataDisplayToggle navKey={PREFIX_ID} />

      <Create routeTitle={routeTitle} filter={filter} />
    </HStack>
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
  const [maximize, setMaximize] = useState<boolean>(false);
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      topic: null as unknown as Interface__SelectOption[],
      materialType: null as unknown as Interface__SelectOption[],
      title: "",
      description: "",
      materialFiles: null as any,
      deleteFileIds: [],
      materialUrl: "",
    },
    validationSchema: yup.object().shape({
      topic: yup.array().required(l.msg_required_form),
      materialType: yup.array().required(l.msg_required_form),
      title: yup.string().required(l.msg_required_form),
      description: yup.string().required(l.msg_required_form),
      materialFiles: fileValidation({
        allowedExtensions: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"],
      })
        .when("materialType", {
          is: (val: Interface__SelectOption[]) =>
            val?.[0]?.id === "gambar" || val?.[0]?.id === "dokumen",
          then: (schema) => schema.required(l.msg_required_form),
          otherwise: (schema) => schema.notRequired(),
        })
        .concat(
          min1File({
            resolvedData,
            existingKey: "materialFiles",
            deletedKey: "deleteFileIds",
            newKey: "materialFiles",
            message: l.msg_required_form,
          })
        ),
      materialUrl: yup.string().when("materialType", {
        is: (val: Interface__SelectOption[]) => val?.[0]?.id === "video",
        then: (schema) => schema.required(l.msg_required_form),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = new FormData();
      payload.append("topicId", `${values.topic?.[0]?.id}`);
      payload.append("materialType", values.materialType?.[0]?.id);
      payload.append("title", values.title);
      payload.append("description", values.description);
      payload.append("isPublic", `0`);
      // if (user?.id) {
      //   payload.append("uploadedBy", `${user.id}`);
      // }
      if (values.materialFiles?.[0]) {
        payload.append("materialFiles", values.materialFiles[0]);
      }
      if (values.materialUrl) {
        payload.append("materialUrl", values.materialUrl);
      }

      const config = {
        url: `${BASE_ENDPOINT}/update/${resolvedData.id}`,
        method: "PATCH",
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
      title: resolvedData.title,
      description: resolvedData.description,
      materialFiles: [],
      deleteFileIds: [],
      materialUrl: resolvedData.materialUrl,
      materialType: [
        {
          id: resolvedData.materialType,
          label: capitalize(resolvedData.materialType),
        },
      ],
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
                <SimpleGrid columns={[1, null, 2]} gap={8}>
                  {/* basic form */}
                  <CContainer gap={4}>
                    <Field
                      label={l.private_navs.kmis.topic}
                      invalid={!!formik.errors.topic}
                      errorText={formik.errors.topic as string}
                    >
                      <SelectKMISTopic
                        inputValue={formik.values.topic}
                        onConfirm={(inputValue) => {
                          formik.setFieldValue("topic", inputValue);
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
                        onChange={(inputValue) =>
                          formik.setFieldValue("title", inputValue)
                        }
                      />
                    </Field>
                  </CContainer>

                  {/* material form */}
                  <CContainer gap={4}>
                    <Field
                      label={l.type}
                      invalid={!!formik.errors.materialType}
                      errorText={formik.errors.materialType as string}
                    >
                      <SelectKMISMaterialType
                        inputValue={formik.values.materialType}
                        onConfirm={(inputValue) => {
                          formik.setFieldValue("materialType", inputValue);
                        }}
                      />
                    </Field>

                    <Field label={l.publicity} disabled>
                      <HStack justify={"space-between"} w={"full"}>
                        <P opacity={0.4}>{l.msg_is_public_kmis_material}</P>
                        <Switch disabled />
                      </HStack>
                    </Field>
                  </CContainer>
                </SimpleGrid>

                <MaterialFormByType
                  type={formik.values.materialType}
                  formik={formik}
                />
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
  const ID = `${PREFIX_ID}_activate`;

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
        url: `${BASE_ENDPOINT}/activate`,
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
      description={l.msg_activate}
      confirmLabel={`${l.restore}`}
      onConfirm={onActivate}
      loading={loading}
      disabled={disabled}
    >
      <MenuTooltip content={l.restore}>
        <MenuItem value="restore" disabled={disabled}>
          {l.restore}
          <Icon boxSize={"18px"} ml={"auto"}>
            <IconActivity stroke={1.5} />
          </Icon>
        </MenuItem>
      </MenuTooltip>
    </ConfirmationDisclosureTrigger>
  );
};
const Delete = (props: any) => {
  const ID = `${PREFIX_ID}_deactivate`;

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
  function onDeactivate() {
    back();
    req({
      config: {
        url: `${BASE_ENDPOINT}/deactivate`,
        method: "PATCH",
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
      description={l.msg_deactivate}
      confirmLabel={`${l.delete_}`}
      onConfirm={onDeactivate}
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
            <IconX stroke={1.5} />
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
    params: {
      search: filter.search,
      topicId: filter.topic?.[0]?.id,
    },
    dependencies: [filter],
  });
  const dataProps: Interface__DataProps = {
    headers: [
      {
        th: l.private_navs.kmis.topic,
        sortable: true,
      },
      {
        th: l.title,
        sortable: true,
      },
      {
        th: l.type,
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
          td: <ClampText>{item.title}</ClampText>,
          value: item.title,
        },
        {
          td: <ClampText>{item.materialType}</ClampText>,
          value: item.materialType,
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
                title: resolvedItem.title,
                description: resolvedItem.description,
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
