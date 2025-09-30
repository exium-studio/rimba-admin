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
        path: `/cms`,
        subMenus: [
          {
            list: [
              {
                labelKey: "navs.cms.static_contents",
                path: `/cms/static-content`,
              },
              {
                labelKey: "navs.cms.legal_documents",
                path: `/cms/legal-document`,
              },
              {
                labelKey: "navs.cms.activity",
                path: `/cms/activity`,
              },
              {
                labelKey: "navs.cms.news",
                path: `/cms/news`,
              },
            ],
          },
        ],
      },
      {
        icon: IconSchool,
        labelKey: "navs.kmis.index",
        path: `/kmis`,
        subMenus: [
          {
            list: [
              {
                labelKey: "navs.kmis.dashboard",
                path: `/kmis/dashboard`,
              },
              {
                labelKey: "navs.kmis.topic",
                path: `/kmis/topic`,
              },
              {
                labelKey: "navs.kmis.quiz",
                path: `/kmis/quiz`,
              },
              {
                labelKey: "navs.kmis.quiz_participant",
                path: `/kmis/quiz-participant`,
              },
              {
                labelKey: "navs.kmis.educator",
                path: `/kmis/educator`,
              },
              {
                labelKey: "navs.kmis.student",
                path: `/kmis/student`,
              },
              {
                labelKey: "navs.kmis.category",
                path: `/kmis/category`,
              },
            ],
          },
        ],
      },
      {
        icon: IconDeviceAnalytics,
        labelKey: "navs.monev.index",
        path: `/monev`,
        subMenus: [
          {
            list: [
              {
                labelKey: "navs.monev.dashboard",
                path: `/monev/dashboard`,
              },
              {
                labelKey: "navs.monev.activity_calendar",
                path: `/monev/activity-calendar`,
              },
              {
                labelKey: "navs.monev.data_sharing",
                path: `/monev/data-sharing`,
              },
              {
                labelKey: "navs.monev.monitoring",
                path: `/monev/monitoring`,
              },
              {
                labelKey: "navs.monev.package_information",
                path: `/monev/package-information`,
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
        path: `/settings`,
        subMenus: [
          {
            groupLabelKey: "settings_navs.main.index",
            list: [
              {
                icon: IconUser,
                labelKey: "my_profile",
                path: `/settings/profile`,
                backPath: `/settings`,
              },
              {
                icon: IconDeviceDesktop,
                labelKey: "settings_navs.main.display",
                path: `/settings/display`,
                backPath: `/settings`,
              },
              {
                icon: IconLanguage,
                labelKey: "settings_navs.main.regional",
                path: `/settings/regional`,
                backPath: `/settings`,
              },
              {
                icon: IconShieldHalf,
                labelKey: "settings_navs.main.permissions",
                path: `/settings/permissions`,
                backPath: `/settings`,
              },
            ],
          },
        ],
      },
      {
        icon: IconUser,
        labelKey: "navs.profile",
        path: `/profile`,
      },
    ],
  },
];

export const MASTER_DATA_NAVS = [];
