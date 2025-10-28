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
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { StringInput } from "@/components/ui/string-input";
import { Textarea } from "@/components/ui/textarea";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ImgViewer } from "@/components/widget/ImgViewer";
import { Interface__CMSTextContent } from "@/constants/interfaces";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useDataState from "@/hooks/useDataState";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import useRequest from "@/hooks/useRequest";
import { back } from "@/utils/client";
import { pluckString } from "@/utils/string";
import {
  HStack,
  Icon,
  InputGroup,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconBulb,
  IconBulbFilled,
  IconPencilMinus,
  IconSection,
  IconTrash,
  IconWorld,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "";
const STATIC_CONTENT_REGISTRY = [
  {
    pageLabelKey: "lp_home_section.index",
    contents: [
      {
        sectionLabelKey: "lp_home_section.hero",
        listIds: [1, 2, 3],
      },
      {
        sectionLabelKey: "lp_home_section.brief",
        listIds: [4],
      },
      {
        sectionLabelKey: "lp_home_section.gallery",
        listIds: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      },
      {
        sectionLabelKey: "lp_home_section.strategy_value",
        listIds: [15, 16, 17, 18, 19, 20, 21, 22, 23],
      },
      {
        sectionLabelKey: "lp_home_section.location",
        listIds: [27, 28, 29, 30, 31, 32, 33, 34, 35],
      },
      {
        sectionLabelKey: "lp_home_section.activity",
        listIds: [24, 25],
      },
      {
        sectionLabelKey: "lp_home_section.impact",
        listIds: [36, 37, 38, 39, 40, 41, 42, 43, 44, 46, 47],
      },
      {
        sectionLabelKey: "lp_home_section.legal_docs",
        listIds: [50, 51],
      },
      {
        sectionLabelKey: "lp_home_section.news",
        listIds: [52],
      },
      {
        sectionLabelKey: "lp_home_section.partner",
        listIds: [53, 54, 55, 56],
      },
      {
        sectionLabelKey: "footer",
        listIds: [57, 58, 59, 60, 61, 62, 63, 64],
      },
    ],
  },
  {
    pageLabelKey: "lp_legal_docs_section.index",
    contents: [
      {
        sectionLabelKey: "lp_legal_docs_section.header",
        listIds: [65],
      },
    ],
  },
  {
    pageLabelKey: "lp_about_section.index",
    contents: [
      {
        sectionLabelKey: "lp_about_section.header",
        listIds: [66],
      },
      {
        sectionLabelKey: "lp_about_section.purpose",
        listIds: [67, 68, 69, 70, 71, 72, 73, 74, 75, 76],
      },
      {
        sectionLabelKey: "lp_about_section.strategy",
        listIds: [77, 78, 79, 80, 81, 82, 83, 85, 86, 84],
      },
      {
        sectionLabelKey: "lp_about_section.progress",
        listIds: [87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97],
      },
      {
        sectionLabelKey: "lp_about_section.achievement_indicator",
        listIds: [
          98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
        ],
      },
      {
        sectionLabelKey: "lp_about_section.orfanizational_structure",
        listIds: [111, 112],
      },
    ],
  },
  {
    pageLabelKey: "lp_activity_section.index",
    contents: [
      {
        sectionLabelKey: "lp_activity_section.header",
        listIds: [113],
      },
    ],
  },
  {
    pageLabelKey: "lp_news_section.index",
    contents: [
      {
        sectionLabelKey: "lp_news_section.header",
        listIds: [114],
      },
    ],
  },
  {
    pageLabelKey: "lp_partner_section.index",
    contents: [
      {
        sectionLabelKey: "lp_partner_section.header",
        listIds: [115],
      },
    ],
  },
];
const allContentIds = STATIC_CONTENT_REGISTRY.flatMap(
  (page) => page.contents
).flatMap((content) => content.listIds);

const TextForm = (props: any) => {
  // Props
  const { content } = props;

  // Contexts
  const { l } = useLang();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req } = useRequest({
    id: "cms-edit",
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { textId: "", textEn: "" },
    validationSchema: yup.object().shape({
      textId: yup.string().required(l.msg_required_form),
      textEn: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      back();

      const payload = {
        type: content.type,
        content: {
          id: values.textId,
          en: values.textEn,
        },
      };

      const config = {
        url: `/api/cms/content/update/${content.id}`,
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
      textId: content.content.id,
      textEn: content.content.en,
    });
  }, [content]);

  return (
    <form id="cms-edit" onSubmit={formik.handleSubmit}>
      <Field
        label={l.content}
        invalid={!!(formik.errors.textId || formik.errors.textEn)}
        errorText={(formik.errors.textId || formik.errors.textEn) as string}
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
            inputValue={formik.values.textId}
            onChange={(inputValue) => {
              formik.setFieldValue("textId", inputValue);
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
            inputValue={formik.values.textEn}
            onChange={(inputValue) => {
              formik.setFieldValue("textEn", inputValue);
            }}
            pl={"40px !important"}
          />
        </InputGroup>
      </Field>
    </form>
  );
};
const TextArrayForm = (props: any) => {
  // Props
  const { content } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req } = useRequest({
    id: "cms-edit",
  });

  // States
  const CMSTextContentSchema = yup.object().shape({
    id: yup.string().trim().required(l.msg_required_form),
    en: yup.string().trim().required(l.msg_required_form),
  });
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { textArray: [] },
    validationSchema: yup.object().shape({
      textArray: yup
        .array()
        .required(l.msg_required_form)
        .test("textArray-validation", l.msg_required_form, function (value) {
          if (!Array.isArray(value) || value.length === 0) return false;

          for (const item of value) {
            try {
              CMSTextContentSchema.validateSync(item);
            } catch {
              return false;
            }
          }

          return true;
        }),
    }),
    onSubmit: (values) => {
      back();

      const payload = {
        type: content.type,
        content: values.textArray,
      };

      const config = {
        url: `/api/cms/content/update/${content.id}`,
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
      textArray: content.content,
    });
  }, [content]);

  return (
    <form id="cms-edit" onSubmit={formik.handleSubmit}>
      <Field
        label={l.content}
        invalid={!!formik.errors.textArray}
        errorText={formik.errors.textArray as string}
        gap={1}
      >
        {formik.values.textArray.map((text: any, idx: number) => {
          return (
            <CContainer key={idx} gap={2} mt={idx !== 0 ? 1 : 0}>
              <HStack justify={"space-between"}>
                <P fontWeight={"medium"} color={"fg.subtle"}>{`No. ${
                  idx + 1
                }`}</P>

                <Btn
                  iconButton
                  size={"sm"}
                  variant={"ghost"}
                  onClick={() => {
                    const newTextArray: Interface__CMSTextContent[] = [
                      ...formik.values.textArray,
                    ];
                    newTextArray.splice(idx, 1);
                    formik.setFieldValue("textArray", newTextArray);
                  }}
                >
                  <Icon>
                    <IconTrash stroke={1.5} />
                  </Icon>
                </Btn>
              </HStack>

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
                <StringInput
                  inputValue={text.id}
                  onChange={(inputValue) => {
                    const newTextArray: Interface__CMSTextContent[] = [
                      ...formik.values.textArray,
                    ];

                    newTextArray[idx] = {
                      ...newTextArray[idx],
                      id: inputValue,
                    };

                    formik.setFieldValue("textArray", newTextArray);
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
                <StringInput
                  inputValue={text.en}
                  onChange={(inputValue) => {
                    const newTextArray: Interface__CMSTextContent[] = [
                      ...formik.values.textArray,
                    ];

                    newTextArray[idx] = {
                      ...newTextArray[idx],
                      en: inputValue,
                    };

                    formik.setFieldValue("textArray", newTextArray);
                  }}
                  pl={"40px !important"}
                />
              </InputGroup>
            </CContainer>
          );
        })}

        <Btn
          w={"full"}
          variant={"outline"}
          colorPalette={themeConfig.colorPalette}
          mt={2}
          onClick={() => {
            const newTextArray: Interface__CMSTextContent[] = [
              ...formik.values.textArray,
            ];
            newTextArray.push({
              id: "",
              en: "",
            });
            formik.setFieldValue("textArray", newTextArray);
          }}
        >
          {l.add}
        </Btn>
      </Field>
    </form>
  );
};
const EditContent = (props: any) => {
  // Props
  const { content, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`edit-cms-${content?.id}`, open, onOpen, onClose);

  // States
  const FORM_REGISTRY = {
    Text: <TextForm content={content} />,
    TextArray: <TextArrayForm content={content} />,
    Link: <></>,
    Image: <></>,
    ImageArray: <></>,
  };

  return (
    <>
      <Btn
        iconButton
        onClick={onOpen}
        size={"sm"}
        variant={"ghost"}
        {...restProps}
      >
        <Icon boxSize={5}>
          <IconPencilMinus stroke={1.5} />
        </Icon>
      </Btn>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`Edit ${l.content}`} />
          </DisclosureHeader>

          <DisclosureBody>
            {FORM_REGISTRY[content?.type as keyof typeof FORM_REGISTRY]}
          </DisclosureBody>

          <DisclosureFooter>
            <Btn
              type="submit"
              form="cms-edit"
              colorPalette={themeConfig.colorPalette}
            >
              {l.save}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
const RenderContent = (props: any) => {
  // Props
  const { type, content } = props;

  // Contexts
  const { lang } = useLang();

  switch (type.toLowerCase()) {
    case "imagearray":
      return (
        <SimpleGrid columns={2} gap={2}>
          {content?.map((content: string, idx: number) => {
            return (
              <ImgViewer
                key={`${idx}-${content}`}
                id={`img-array-${idx}-${content}`}
                w={"full"}
                src={content}
              >
                <Img src={content} fluid w={"full"} />
              </ImgViewer>
            );
          })}
        </SimpleGrid>
      );
    case "image":
      return (
        <ImgViewer
          key={`${content}`}
          id={`img-${content}`}
          w={"full"}
          src={content}
        >
          <Img src={content} fluid w={"full"} />
        </ImgViewer>
      );
    case "textarray":
      return (
        <CContainer gap={2}>
          {content?.map((content: Interface__CMSTextContent, idx: number) => {
            return (
              <P key={idx} color={"fg.muted"}>
                {content?.[lang]}
              </P>
            );
          })}
        </CContainer>
      );
    case "link":
      return (
        <NavLink to={content} external>
          <P color={"p.500"}>{content}</P>
        </NavLink>
      );
    default:
      return <P color={"fg.muted"}>{content?.[lang]}</P>;
  }
};

export default function Page() {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const iss = useIsSmScreenWidth();

  // States
  const [previewURL, setPreviewURL] = useState<string>(baseUrl);
  const [search, setSearch] = useState<string>("");
  const resolvedRegistry = !search.trim()
    ? STATIC_CONTENT_REGISTRY
    : STATIC_CONTENT_REGISTRY.map((page) => ({
        ...page,
        contents: page.contents
          .map((content) => ({
            ...content,
            listIds: content.listIds.filter((id) =>
              search.includes(id.toString())
            ),
          }))
          .filter((content) => content.listIds.length > 0),
      })).filter((page) => page.contents.length > 0);
  const { error, initialLoading, data, onRetry } = useDataState<any>({
    initialData: undefined,
    url: `/api/cms/public-request/get-all-content`,
    dataResource: false,
    dependencies: [],
  });
  const staticContents = data?.staticContents;
  const p = 16;

  const render = {
    loading: <Skeleton flex={1} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    loaded: (
      <HStack
        flex={1}
        gap={0}
        rounded={themeConfig.radii.container}
        bg={"body"}
        align={"stretch"}
        overflowY={"auto"}
      >
        <CContainer flex={"2 0 0"} p={2}>
          {baseUrl && (
            <iframe
              src={previewURL}
              style={{
                width: "100%",
                height: `calc(100vh - 52px - ${p * 2}px ${
                  iss ? "- (29px + 78.8px)" : ""
                })`,
              }}
              title="CMS Preview"
            />
          )}
          {!baseUrl && <P m={"auto"}>Website URL not found</P>}
        </CContainer>

        <CContainer flex={"1 0 0"} overflowY={"auto"}>
          <HStack px={4} py={4}>
            <SearchInput
              queryKey="cms-content"
              inputValue={search}
              onChange={(inputValue) => {
                setSearch(inputValue);
              }}
              placeholder={`${l.search} ID`}
            />

            <Btn
              iconButton
              variant={"outline"}
              color={previewURL === baseUrl ? "" : "p.500"}
              onClick={() => {
                if (previewURL === baseUrl) {
                  setPreviewURL(
                    `${baseUrl}?highlightedContentIds=${allContentIds.join(
                      ", "
                    )}`
                  );
                } else {
                  setPreviewURL(baseUrl);
                }
              }}
            >
              <Icon>
                {previewURL === baseUrl ? <IconBulb /> : <IconBulbFilled />}
              </Icon>
            </Btn>
          </HStack>

          <CContainer
            className="scrollY"
            pl={`${p}px`}
            pr={`calc(${p}px - 8px)`}
            gap={4}
          >
            {staticContents &&
              resolvedRegistry.map((reg) => {
                return (
                  <CContainer key={reg.pageLabelKey} gap={2}>
                    <HStack color={"fg.subtle"}>
                      <Icon boxSize={5}>
                        <IconWorld stroke={1.5} />
                      </Icon>

                      <P fontWeight={"medium"}>
                        {pluckString(l, reg.pageLabelKey)}
                      </P>
                    </HStack>

                    {reg.contents.map((section) => {
                      return (
                        <CContainer
                          key={section.sectionLabelKey}
                          gap={1}
                          rounded={themeConfig.radii.component}
                          border={"1px solid"}
                          borderColor={"d1"}
                        >
                          <HStack color={"fg.subtle"} px={3} py={2}>
                            <Icon boxSize={5}>
                              <IconSection stroke={1.5} />
                            </Icon>

                            <P fontWeight={"medium"}>
                              {pluckString(l, section.sectionLabelKey)}
                            </P>
                          </HStack>

                          <CContainer p={2} pt={0} gap={2}>
                            {section.listIds.map((id, idx) => {
                              const content = staticContents[id];

                              return (
                                <CContainer
                                  key={idx}
                                  align={"start"}
                                  gap={1}
                                  rounded={`calc(${themeConfig.radii.component} - 1px)`}
                                  border={"1px solid"}
                                  borderColor={"d1"}
                                >
                                  <HStack
                                    justify={"space-between"}
                                    w={"full"}
                                    mb={1}
                                    px={3}
                                    py={2}
                                  >
                                    <HStack gap={4}>
                                      <P
                                        fontWeight={"medium"}
                                      >{`ID: ${content.id}`}</P>
                                      <P
                                        color={"fg.subtle"}
                                      >{`${content.type}`}</P>
                                    </HStack>

                                    <HStack>
                                      <EditContent content={content} />
                                    </HStack>

                                    {/* <P>{`No. ${idx + 1}`}</P> */}
                                  </HStack>

                                  <CContainer p={3} pt={0}>
                                    <RenderContent
                                      type={content.type}
                                      content={content.content}
                                    />
                                  </CContainer>
                                </CContainer>
                              );
                            })}
                          </CContainer>
                        </CContainer>
                      );
                    })}
                  </CContainer>
                );
              })}
          </CContainer>
        </CContainer>
      </HStack>
    ),
  };

  return (
    <CContainer flex={1} p={`${p}px`} overflowY={"auto"}>
      {initialLoading && render.loading}
      {!initialLoading && (
        <>
          {error && render.error}
          {!error && (
            <>
              {data && render.loaded}
              {!data && render.empty}
            </>
          )}
        </>
      )}
    </CContainer>
  );
}
