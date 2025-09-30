import { Interface__NavItem } from "@/constants/interfaces";
import {
  IconDeviceDesktop,
  IconDeviceDesktopAnalytics,
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
        labelKey: "private_navs.cms.index",
        path: `/cms`,
        subMenus: [
          {
            list: [
              {
                labelKey: "private_navs.cms.static_contents",
                path: `/cms/static-content`,
              },
              {
                labelKey: "private_navs.cms.legal_documents",
                path: `/cms/legal-document`,
              },
              {
                labelKey: "private_navs.cms.activity",
                path: `/cms/activity`,
              },
              {
                labelKey: "private_navs.cms.news",
                path: `/cms/news`,
              },
            ],
          },
        ],
      },
      {
        icon: IconSchool,
        labelKey: "private_navs.kmis.index",
        path: `/kmis`,
        subMenus: [
          {
            list: [
              {
                labelKey: "private_navs.kmis.dashboard",
                path: `/kmis/dashboard`,
              },
              {
                labelKey: "private_navs.kmis.topic",
                path: `/kmis/topic`,
              },
              {
                labelKey: "private_navs.kmis.material",
                path: `/kmis/material`,
              },
              {
                labelKey: "private_navs.kmis.quiz",
                path: `/kmis/quiz`,
              },
              {
                labelKey: "private_navs.kmis.quiz_assessment",
                path: `/kmis/quiz-assessment`,
              },
              {
                labelKey: "private_navs.kmis.educator",
                path: `/kmis/educator`,
              },
              {
                labelKey: "private_navs.kmis.student",
                path: `/kmis/student`,
              },
              {
                labelKey: "private_navs.kmis.category",
                path: `/kmis/category`,
              },
            ],
          },
        ],
      },
      {
        icon: IconDeviceDesktopAnalytics,
        labelKey: "private_navs.monev.index",
        path: `/monev`,
        subMenus: [
          {
            list: [
              {
                labelKey: "private_navs.monev.dashboard",
                path: `/monev/dashboard`,
              },
              {
                labelKey: "private_navs.monev.activity_calendar",
                path: `/monev/activity-calendar`,
              },
              {
                labelKey: "private_navs.monev.data_sharing",
                path: `/monev/data-sharing`,
              },
              {
                labelKey: "private_navs.monev.monitoring",
                path: `/monev/monitoring`,
              },
              {
                labelKey: "private_navs.monev.package_information",
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
        labelKey: "private_navs.settings",
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
        labelKey: "private_navs.profile",
        path: `/profile`,
      },
    ],
  },
];

export const MASTER_DATA_NAVS = [];
