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
import { Field } from "@/components/ui/field";
import { FileInput } from "@/components/ui/file-input";
import SearchInput from "@/components/ui/search-input";
import { StringInput } from "@/components/ui/string-input";
import { Textarea } from "@/components/ui/textarea";
import { ContentTableContainer } from "@/components/widget/ContentTableContainer";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { Interface__KMISCourseCategory } from "@/constants/interfaces";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useDataState from "@/hooks/useDataState";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray } from "@/utils/array";
import { fileValidation } from "@/utils/validationSchema";
import {
  FieldsetRoot,
  HStack,
  Icon,
  StackProps,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconPencilMinus,
  IconPlus,
  IconRestore,
  IconTrash,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";

interface Props extends StackProps {}

const Create = () => {
  const ID = "create_topic_category";

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(ID, open, onOpen, onClose);
  const { req, loading } = useRequest({
    id: ID,
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { files: null as any, title: "", description: "" },
    validationSchema: yup.object().shape({
      files: fileValidation({
        maxSizeMB: 10,
        allowedExtensions: ["jpg", "jpeg", "png"],
      }),
      title: yup.string().required(l.msg_required_form),
      description: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = new FormData();
      payload.append("files", values.files[0]);
      payload.append("title", values.title);
      payload.append("description", values.description);

      const config = {
        url: `/api/kmis/category/create`,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            resetForm();
          },
        },
      });
    },
  });

  console.log(formik.values.files);

  return (
    <>
      <Btn
        iconButton
        size={"md"}
        colorPalette={themeConfig.colorPalette}
        onClick={onOpen}
      >
        <Icon>
          <IconPlus stroke={1.5} />
        </Icon>
      </Btn>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={`${l.add} ${l.private_navs.kmis.category}`}
            />
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
const TableUtils = (props: any) => {
  // Props
  const { filter, setFilter, ...restProps } = props;

  return (
    <HStack p={3} {...restProps}>
      <SearchInput />

      <Create />
    </HStack>
  );
};
const Table = (props: any) => {
  // Props
  const { filter, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // States
  const { error, loading, data, makeRequest, limit, page } = useDataState<
    Interface__KMISCourseCategory[]
  >({
    initialData: undefined,
    url: `/api/kmis/category/index`,
    dependencies: [],
  });
  const tableProps = {
    headers: [
      {
        th: l.title,
        sortable: true,
      },
      {
        th: l.description,
        sortable: true,
      },
    ],
    rows: data?.map((item, idx) => ({
      id: item.id,
      idx: idx,
      data: item,
      columns: [
        {
          td: item.title,
          value: item.title,
        },
        {
          td: item.description,
          value: item.description,
        },
      ],
    })),
    rowOptions: [
      {
        label: "Edit",
        icon: <IconPencilMinus stroke={1.5} />,
        onClick: () => {
          console.log("Edit");
        },
      },
      {
        label: "Restore",
        icon: <IconRestore stroke={1.5} />,
        onClick: () => {
          console.log("Restore");
        },
      },
      {
        // disabled: true,
        label: "Delete",
        icon: <IconTrash stroke={1.5} />,
        menuItemProps: { color: "fg.error" },
        onClick: () => {
          console.log("Delete");
        },
      },
    ],
    batchOptions: [
      {
        label: "Restore",
        icon: <IconRestore stroke={1.5} />,
        onClick: () => {
          console.log("Restore");
        },
      },
      {
        // disabled: true,
        label: "Delete",
        icon: <IconTrash stroke={1.5} />,
        menuItemProps: { color: "fg.error" },
        onClick: () => {
          console.log("Delete");
        },
      },
    ],
  };
  const render = {
    loading: <CSpinner />,
    error: <FeedbackRetry onRetry={makeRequest} />,
    empty: <FeedbackNoData />,
    loaded: (
      <DataTable
        headers={tableProps.headers}
        rows={tableProps.rows}
        rowOptions={tableProps.rowOptions}
        batchOptions={tableProps.batchOptions}
        limit={limit}
        page={page}
      />
    ),
  };

  return (
    <>
      {loading && render.loading}
      {!loading && (
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

export default function KMISCategoryPage(props: Props) {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const DEFAULT_FILTER = {
    search: "",
  };
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  return (
    <ContentTableContainer {...restProps}>
      <CContainer flex={1} bg={"body"} rounded={themeConfig.radii.container}>
        <TableUtils filter={filter} setFilter={setFilter} />
        <Table filter={filter} />
      </CContainer>
    </ContentTableContainer>
  );
}
