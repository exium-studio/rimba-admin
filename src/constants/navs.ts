import { Interface__NavItem } from "@/constants/interfaces";
import {
  IconDeviceAnalytics,
  IconDeviceDesktop,
  IconLanguage,
  IconSchool,
  IconSettings,
  IconShieldHalf,
  IconUser,
  IconWorld,
} from "@tabler/icons-react";

export const PRIVATE_ROUTE_INDEX = "/pvt";

export const PRIVATE_NAVS: Interface__NavItem[] = [
  {
    groupLabelKey: "main",
    list: [
      {
        icon: IconWorld,
        labelKey: "navs.cms.index",
        path: `${PRIVATE_ROUTE_INDEX}/cms`,
        subMenus: [
          {
            list: [
              {
                labelKey: "navs.cms.static_contents",
                path: `${PRIVATE_ROUTE_INDEX}/cms/static-contents`,
              },
              {
                labelKey: "navs.cms.legal_documents",
                path: `${PRIVATE_ROUTE_INDEX}/cms/legal-documents`,
              },
              {
                labelKey: "navs.cms.activities",
                path: `${PRIVATE_ROUTE_INDEX}/cms/activities`,
              },
              {
                labelKey: "navs.cms.news",
                path: `${PRIVATE_ROUTE_INDEX}/cms/news`,
              },
            ],
          },
        ],
      },
      {
        icon: IconSchool,
        labelKey: "navs.kmis.index",
        path: `${PRIVATE_ROUTE_INDEX}/kmis`,
        subMenus: [
          {
            list: [
              {
                labelKey: "navs.kmis.dashboard",
                path: `${PRIVATE_ROUTE_INDEX}/kmis/dashboard`,
              },
              {
                labelKey: "navs.kmis.topic",
                path: `${PRIVATE_ROUTE_INDEX}/kmis/topic`,
              },
              {
                labelKey: "navs.kmis.quiz",
                path: `${PRIVATE_ROUTE_INDEX}/kmis/quiz`,
              },
              {
                labelKey: "navs.kmis.quiz_participant",
                path: `${PRIVATE_ROUTE_INDEX}/kmis/quiz-participant`,
              },
              {
                labelKey: "navs.kmis.educator",
                path: `${PRIVATE_ROUTE_INDEX}/kmis/educator`,
              },
              {
                labelKey: "navs.kmis.student",
                path: `${PRIVATE_ROUTE_INDEX}/kmis/student`,
              },
              {
                labelKey: "navs.kmis.category",
                path: `${PRIVATE_ROUTE_INDEX}/kmis/category`,
              },
            ],
          },
        ],
      },
      {
        icon: IconDeviceAnalytics,
        labelKey: "navs.monev.index",
        path: `${PRIVATE_ROUTE_INDEX}/monev`,
        subMenus: [
          {
            list: [
              {
                labelKey: "navs.monev.dashboard",
                path: `${PRIVATE_ROUTE_INDEX}/monev/dashboard`,
              },
              {
                labelKey: "navs.monev.activity_calendar",
                path: `${PRIVATE_ROUTE_INDEX}/monev/activity-calendar`,
              },
              {
                labelKey: "navs.monev.data_sharing",
                path: `${PRIVATE_ROUTE_INDEX}/monev/data-sharing`,
              },
              {
                labelKey: "navs.monev.monitoring",
                path: `${PRIVATE_ROUTE_INDEX}/monev/monitoring`,
              },
              {
                labelKey: "navs.monev.package_information",
                path: `${PRIVATE_ROUTE_INDEX}/monev/package-information`,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const OTHER_NAVS: Interface__NavItem[] = [
  {
    groupLabelKey: "other",
    list: [
      {
        icon: IconSettings,
        labelKey: "navs.settings",
        path: `${PRIVATE_ROUTE_INDEX}/settings`,
        subMenus: [
          {
            groupLabelKey: "settings_navs.main.index",
            list: [
              {
                icon: IconUser,
                labelKey: "my_profile",
                path: `${PRIVATE_ROUTE_INDEX}/settings/profile`,
                backPath: `${PRIVATE_ROUTE_INDEX}/settings`,
              },
              {
                icon: IconDeviceDesktop,
                labelKey: "settings_navs.main.display",
                path: `${PRIVATE_ROUTE_INDEX}/settings/display`,
                backPath: `${PRIVATE_ROUTE_INDEX}/settings`,
              },
              {
                icon: IconLanguage,
                labelKey: "settings_navs.main.regional",
                path: `${PRIVATE_ROUTE_INDEX}/settings/regional`,
                backPath: `${PRIVATE_ROUTE_INDEX}/settings`,
              },
              {
                icon: IconShieldHalf,
                labelKey: "settings_navs.main.permissions",
                path: `${PRIVATE_ROUTE_INDEX}/settings/permissions`,
                backPath: `${PRIVATE_ROUTE_INDEX}/settings`,
              },
            ],
          },
        ],
      },
      {
        icon: IconUser,
        labelKey: "navs.profile",
        path: `${PRIVATE_ROUTE_INDEX}/profile`,
      },
    ],
  },
];

export const MASTER_DATA_NAVS = [];
