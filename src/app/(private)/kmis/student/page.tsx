"use client";

import { MenuItem } from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import { AccountStatus } from "@/components/widget/AccountStatus";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { DataDisplayToggle } from "@/components/widget/DataDisplayToggle";
import { DataGrid } from "@/components/widget/DataGrid";
import { DataGridItem } from "@/components/widget/DataGridItem";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { MiniUser } from "@/components/widget/MiniUser";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import {
  Interface__BatchOptionsTableOptionGenerator,
  Interface__DataProps,
  Interface__KMISStudent,
  Interface__RowOptionsTableOptionGenerator,
} from "@/constants/interfaces";
import { SVGS_PATH } from "@/constants/paths";
import { useDataDisplay } from "@/context/useDataDisplay";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import useDataState from "@/hooks/useDataState";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray, last } from "@/utils/array";
import { back } from "@/utils/client";
import { formatDate, formatNumber } from "@/utils/formatter";
import { capitalize, pluckString } from "@/utils/string";
import { getActiveNavs, imgUrl } from "@/utils/url";
import { HStack, Icon } from "@chakra-ui/react";
import { IconActivity, IconX } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const BASE_ENDPOINT = "/api/kmis/student";
const PREFIX_ID = "kmis_student";
type Interface__Data = Interface__KMISStudent;

// const Update = (props: any) => {
//   const ID = `${PREFIX_ID}_update`;

//   // Props
//   const { data, routeTitle } = props;
//   const resolvedData = data as Interface__Data;

//   // Contexts
//   const { l } = useLang();
//   const { themeConfig } = useThemeConfig();
//   const setRt = useRenderTrigger((s) => s.setRt);

//   // Hooks
//   const { open, onOpen, onClose } = useDisclosure();
//   useBackOnClose(
//     disclosureId(`${ID}-${resolvedData?.id}`),
//     open,
//     onOpen,
//     onClose
//   );
//   const { req, loading } = useRequest({
//     id: ID,
//     loadingMessage: {
//       title: capitalize(`Edit ${routeTitle}`),
//     },
//     successMessage: {
//       title: capitalize(`Edit ${routeTitle} ${l.successful}`),
//     },
//   });

//   // States
//   const formik = useFormik({
//     validateOnChange: false,
//     initialValues: {
//       files: null as any,
//       title: "",
//       description: "",
//       deleteDocumentIds: [],
//     },
//     validationSchema: yup.object().shape({
//       files: fileValidation({
//         maxSizeMB: 10,
//         allowedExtensions: ["jpg", "jpeg", "png"],
//       }),
//       title: yup.string().required(l.msg_required_form),
//       description: yup.string().required(l.msg_required_form),
//     }),
//     onSubmit: (values) => {
//       back();

//       const payload = new FormData();
//       if (values.files?.[0]) {
//         payload.append("files", values.files[0]);
//       }
//       payload.append("title", values.title);
//       payload.append("description", values.description);
//       payload.append(
//         "deletedDocumentIds",
//         JSON.stringify(values.deleteDocumentIds)
//       );

//       const config = {
//         url: `${BASE_ENDPOINT}/update/${resolvedData.id}`,
//         method: "PATCH",
//         data: payload,
//       };

//       req({
//         config,
//         onResolve: {
//           onSuccess: () => {
//             setRt((ps) => !ps);
//           },
//         },
//       });
//     },
//   });

//   useEffect(() => {
//     formik.setValues({
//       files: [],
//       title: resolvedData.title,
//       description: resolvedData.description,
//       deleteDocumentIds: [],
//     });
//   }, [resolvedData]);

//   return (
//     <>
//       <MenuItem value="edit" onClick={onOpen}>
//         Edit
//         <Icon boxSize={"18px"} ml={"auto"}>
//           <IconPencilMinus stroke={1.5} />
//         </Icon>
//       </MenuItem>

//       <DisclosureRoot open={open} lazyLoad size={"xs"}>
//         <DisclosureContent>
//           <DisclosureHeader>
//             <DisclosureHeaderContent title={`Edit ${routeTitle}`} />
//           </DisclosureHeader>

//           <DisclosureBody>
//             <form id={ID} onSubmit={formik.handleSubmit}>
//               <FieldsetRoot disabled={loading}>
//                 <Field
//                   label={"Thumbnail"}
//                   invalid={!!formik.errors.files}
//                   errorText={formik.errors.files as string}
//                 >
//                   <FileInput
//                     dropzone
//                     inputValue={formik.values.files}
//                     onChange={(inputValue) => {
//                       formik.setFieldValue("files", inputValue);
//                     }}
//                     existingFiles={resolvedData.categoryCover}
//                     onDeleteFile={(fileData) => {
//                       formik.setFieldValue(
//                         "deleteDocumentIds",
//                         Array.from(
//                           new Set([
//                             ...formik.values.deleteDocumentIds,
//                             fileData.id,
//                           ])
//                         )
//                       );
//                     }}
//                     onUndoDeleteFile={(fileData) => {
//                       formik.setFieldValue(
//                         "deleteDocumentIds",
//                         formik.values.deleteDocumentIds.filter(
//                           (id: string) => id !== fileData.id
//                         )
//                       );
//                     }}
//                   />
//                 </Field>

//                 <Field
//                   label={l.title}
//                   invalid={!!formik.errors.title}
//                   errorText={formik.errors.title as string}
//                 >
//                   <StringInput
//                     inputValue={formik.values.title}
//                     onChange={(inputValue) => {
//                       formik.setFieldValue("title", inputValue);
//                     }}
//                   />
//                 </Field>

//                 <Field
//                   label={l.description}
//                   invalid={!!formik.errors.description}
//                   errorText={formik.errors.description as string}
//                 >
//                   <Textarea
//                     inputValue={formik.values.description}
//                     onChange={(inputValue) => {
//                       formik.setFieldValue("description", inputValue);
//                     }}
//                   />
//                 </Field>
//               </FieldsetRoot>
//             </form>
//           </DisclosureBody>

//           <DisclosureFooter>
//             <Btn
//               type="submit"
//               form={ID}
//               colorPalette={themeConfig.colorPalette}
//               loading={loading}
//             >
//               {l.save}
//             </Btn>
//           </DisclosureFooter>
//         </DisclosureContent>
//       </DisclosureRoot>
//     </>
//   );
// };

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

      <DataDisplayToggle navKey={PREFIX_ID} />
    </HStack>
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
      <MenuTooltip content={l.activate}>
        <MenuItem value="activate" disabled={disabled}>
          {l.activate}
          <Icon boxSize={"18px"} ml={"auto"}>
            <IconActivity stroke={1.5} />
          </Icon>
        </MenuItem>
      </MenuTooltip>
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
      <MenuTooltip content={l.deactivate}>
        <MenuItem value="deactivate" color={"fg.error"} disabled={disabled}>
          {l.deactivate}
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
        th: l.deleted,
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
      dim: !!item.deletedAt,
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
          td: formatDate(item.deletedAt, {
            variant: "numeric",
            withTime: true,
            dashEmpty: true,
          }),
          value: item.deletedAt,
          dataType: "date",
        },
        {
          td: formatDate(item.user.deactiveAt, {
            variant: "numeric",
            withTime: true,
            dashEmpty: true,
          }),
          value: item.user.deactiveAt,
          dataType: "date",
        },
      ],
    })),
    rowOptions: [
      // (row) => ({
      //   override: <Update data={row.data} routeTitle={routeTitle} />,
      // }),
      (row) => ({
        override: (
          <Activate
            activateAccountIds={[row.data.id]}
            disabled={row.data.user.accountStatus == `2`}
            routeTitle={routeTitle}
          />
        ),
      }),
      (row) => ({
        override: (
          <Deactivate
            deactivateAccountIds={[row.data.id]}
            disabled={row.data.user.accountStatus != `2`}
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
                .some((item) => item.user.accountStatus == `2`)
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
                .some((item) => item.user.accountStatus != `2`)
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
                img: imgUrl(resolvedItem.user.photoProfile?.[0]?.filePath),
                imgFallbackSrc: `${SVGS_PATH}/no-avatar.svg`,
                title: (
                  <HStack>
                    <P fontWeight={"semibold"} lineClamp={1}>
                      {resolvedItem?.user?.name}
                    </P>

                    <AccountStatus
                      accountStatusId={resolvedItem.user.accountStatus}
                      pos={"absolute"}
                      top={2}
                      left={2}
                    />
                  </HStack>
                ),
                description: resolvedItem?.user?.email,
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
