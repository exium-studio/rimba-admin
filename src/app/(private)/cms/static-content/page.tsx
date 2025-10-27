"use client";

import { CContainer } from "@/components/ui/c-container";
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { ImgViewer } from "@/components/widget/ImgViewer";
import { Interface__CMSTextContent } from "@/constants/interfaces";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useDataState from "@/hooks/useDataState";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { pluckString } from "@/utils/string";
import { HStack, Icon, SimpleGrid } from "@chakra-ui/react";
import { IconSection, IconWorld } from "@tabler/icons-react";

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
            return <P key={idx}>{content?.[lang]}</P>;
          })}
        </CContainer>
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
  const { error, initialLoading, data, onRetry } = useDataState<any>({
    initialData: undefined,
    url: `/api/cms/public-request/get-all-content`,
    dataResource: false,
    dependencies: [],
  });
  const staticContents = data?.staticContents;
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "";
  const iframeUrl = `${baseUrl}?cms-token=random`;
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
              src={iframeUrl}
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

        <CContainer
          className="scrollY"
          flex={"1 0 0"}
          p={4}
          pr={"calc(16px - 8px)"}
          gap={4}
        >
          <>
            {
              staticContents &&
                STATIC_CONTENT_REGISTRY.map((reg) => {
                  return (
                    <CContainer key={reg.pageLabelKey} gap={2}>
                      <HStack color={"fg.subtle"}>
                        <Icon boxSize={5}>
                          <IconWorld stroke={1.5} />
                        </Icon>

                        <P>{pluckString(l, reg.pageLabelKey)}</P>
                      </HStack>

                      {reg.contents.map((section) => {
                        return (
                          <CContainer
                            key={section.sectionLabelKey}
                            bg={"d0"}
                            gap={1}
                            rounded={themeConfig.radii.component}
                          >
                            <HStack color={"fg.subtle"} px={2} py={1}>
                              <Icon boxSize={5}>
                                <IconSection stroke={1.5} />
                              </Icon>

                              <P color={"fg.muted"}>
                                {pluckString(l, section.sectionLabelKey)}
                              </P>
                            </HStack>

                            <CContainer p={1} pt={0} gap={2}>
                              {section.listIds.map((id, idx) => {
                                const content = staticContents[id];

                                return (
                                  <CContainer
                                    key={idx}
                                    align={"start"}
                                    gap={1}
                                    bg={"d0"}
                                    rounded={themeConfig.radii.component}
                                    border={"1px solid"}
                                    borderColor={"d1"}
                                  >
                                    <HStack
                                      justify={"space-between"}
                                      w={"full"}
                                      mb={1}
                                      px={2}
                                      py={1}
                                    >
                                      <HStack gap={4}>
                                        <P
                                          fontWeight={"medium"}
                                        >{`ID: ${content.id}`}</P>
                                        <P
                                          color={"fg.subtle"}
                                        >{`${content.type}`}</P>
                                      </HStack>

                                      {/* <P>{`No. ${idx + 1}`}</P> */}
                                    </HStack>

                                    <CContainer p={2} pt={0}>
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
                })
              // Object.keys(staticContents)?.map((key: string) => {
              //   const item = staticContents[key];
              //   const renderKey = item.id;
              //   return (
              //     <CContainer
              //       key={renderKey}
              //       align={"start"}
              //       rounded={themeConfig.radii.component}
              //       bg={"d0"}
              //     >
              //       <HStack
              //         justify={"space-between"}
              //         w={"full"}
              //         px={4}
              //         py={2}
              //         mb={1}
              //       >
              //         <HStack gap={4}>
              //           <P fontWeight={"medium"}>{`ID: ${item.id}`}</P>
              //           <P color={"fg.subtle"}>{`${item.type}`}</P>
              //         </HStack>

              //         {/* <P>{`No. ${idx + 1}`}</P> */}
              //       </HStack>

              //       <CContainer p={4} pt={0}>
              //         <RenderContent type={item.type} content={item.content} />
              //       </CContainer>
              //     </CContainer>
              //   );
              // })
            }
          </>
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
