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
import { MenuItem } from "@/components/ui/menu";
import SearchInput from "@/components/ui/search-input";
import { StringInput } from "@/components/ui/string-input";
import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import BackButton from "@/components/widget/BackButton";
import { ClampText } from "@/components/widget/ClampText";
import { DataGrid } from "@/components/widget/DataGrid";
import { DataGridItem } from "@/components/widget/DataGridItem";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { MiniUser } from "@/components/widget/MiniUser";
import { PageContent } from "@/components/widget/Page";
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import {
  Interface__DataProps,
  Interface__MonevPICAccount,
  Interface__MonevPICDivision,
  Interface__RowOptionsTableOptionGenerator,
  Interface__User,
} from "@/constants/interfaces";
import { useDataDisplay } from "@/context/useDataDisplay";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useDataState from "@/hooks/useDataState";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray, last } from "@/utils/array";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { formatDate } from "@/utils/formatter";
import { capitalize, pluckString } from "@/utils/string";
import { getActiveNavs } from "@/utils/url";
import { FieldsetRoot, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import {
  IconPencilMinus,
  IconPlus,
  IconTrash,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import * as yup from "yup";

const BASE_ENDPOINT = "/api/master-data/pic-division";
const PREFIX_ID = "monev_pic_assignment";
type Interface__Data = Interface__MonevPICDivision;

const DivisionPICs = (props: any) => {
  // Props
  const { picDivision, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(`PIC-${picDivision?.id}`), open, onOpen, onClose);

  return (
    <>
      <Btn onClick={onOpen} size={"sm"} variant={"ghost"} {...restProps}>
        <Icon boxSize={5}>
          <IconUsersGroup stroke={1.5} />
        </Icon>
        PIC
      </Btn>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`PIC`} />
          </DisclosureHeader>

          <DisclosureBody>
            {isEmptyArray(picDivision.userPic) && <FeedbackNoData />}

            {picDivision.userPic?.map((user: Interface__User) => {
              return <MiniUser key={user.id} user={user} />;
            })}
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

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
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      PICs: [] as Interface__MonevPICAccount[],
    },
    validationSchema: yup.object().shape({
      PICs: yup.array(),
    }),
    onSubmit: (values) => {
      back();

      const payload = {
        userPic: values.PICs,
      };

      const config = {
        url: `${BASE_ENDPOINT}/assign/${resolvedData.id}`,
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
      PICs: !isEmptyArray(resolvedData.userPic)
        ? resolvedData.userPic
        : [
            {
              name: "",
              email: "",
            },
          ],
    });
  }, [open, resolvedData]);

  return (
    <>
      <MenuTooltip content={"Edit"}>
        <MenuItem value="edit" onClick={onOpen}>
          {`${l.manage} PIC`}
          <Icon boxSize={"18px"} ml={"auto"}>
            <IconPencilMinus stroke={1.5} />
          </Icon>
        </MenuItem>
      </MenuTooltip>

      <DisclosureRoot open={open} lazyLoad size={"md"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${l.manage} PIC`} />
          </DisclosureHeader>

          <DisclosureBody>
            <form id={ID} onSubmit={formik.handleSubmit}>
              <FieldsetRoot disabled={loading}>
                <Field
                  label={"PIC"}
                  invalid={!!formik.errors.PICs}
                  errorText={formik.errors.PICs as string}
                >
                  <CContainer gap={2}>
                    {formik.values.PICs.map((item, idx) => {
                      return (
                        <HStack key={idx}>
                          <StringInput
                            inputValue={item?.name}
                            onChange={(inputValue) => {
                              const updated = [...formik.values.PICs];
                              updated[idx].name = inputValue;
                              formik.setFieldValue("PICs", updated);
                            }}
                            flex={3}
                            placeholder={l.name}
                          />
                          <StringInput
                            inputValue={item?.email}
                            onChange={(inputValue) => {
                              const updated = [...formik.values.PICs];
                              updated[idx].email = inputValue;
                              formik.setFieldValue("PICs", updated);
                            }}
                            flex={2}
                            placeholder="Email"
                          />

                          <Btn
                            iconButton
                            variant={"outline"}
                            size={"md"}
                            onClick={() => {
                              formik.setFieldValue("PICs", [
                                ...formik.values.PICs.filter(
                                  (_, fidx) => idx !== fidx
                                ),
                              ]);
                            }}
                          >
                            <Icon>
                              <IconTrash stroke={1.5} />
                            </Icon>
                          </Btn>
                        </HStack>
                      );
                    })}

                    <Btn
                      variant={
                        formik.values.PICs.length > 0 ? "ghost" : "outline"
                      }
                      w={formik.values.PICs.length > 0 ? "fit" : "full"}
                      ml={"auto"}
                      pl={3}
                      size={"md"}
                      onClick={() => {
                        formik.setFieldValue("PICs", [
                          ...formik.values.PICs,
                          {
                            name: "",
                            value: null,
                          },
                        ]);
                      }}
                    >
                      <Icon>
                        <IconPlus stroke={1.5} />
                      </Icon>
                      {l.add}
                    </Btn>
                  </CContainer>
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
        th: l.settings_navs.monev_master_data.pic_division,
      },
      {
        th: "PIC",
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
          td: <ClampText>{item?.title}</ClampText>,
          value: item?.title,
        },
        {
          td: <DivisionPICs picDivision={item} />,
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
    ] as Interface__RowOptionsTableOptionGenerator<Interface__Data>[],
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
    <PageContent>
      <DataUtils
        filter={filter}
        setFilter={setFilter}
        routeTitle={routeTitle}
      />
      <Data filter={filter} routeTitle={routeTitle} />
    </PageContent>
  );
}
