import { Interface__NavItem } from "@/constants/interfaces";
import {
  IconCategory,
  IconChecklist,
  IconDeviceDesktop,
  IconDeviceDesktopAnalytics,
  IconLanguage,
  IconSchool,
  IconSettings,
  IconShieldHalf,
  IconUser,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";

// Role Ids
// 1 Super Admin (id 1 & 2 God Admin)
// 2 Educator
// 3 Monev
// 4 Public

export const PRIVATE_NAVS: Interface__NavItem[] = [
  {
    groupLabelKey: "main",
    list: [
      {
        icon: IconWorld,
        labelKey: "private_navs.cms.index",
        path: `/cms`,
        allowedRoles: ["1"],
        subMenus: [
          {
            list: [
              {
                labelKey: "private_navs.cms.static_content",
                path: `/cms/static-content`,
                allowedRoles: ["1"],
              },
              {
                labelKey: "private_navs.cms.legal_document",
                path: `/cms/legal-document`,
                allowedRoles: ["1"],
              },
              {
                labelKey: "private_navs.cms.activity",
                path: `/cms/activity`,
                allowedRoles: ["1"],
              },
              {
                labelKey: "private_navs.cms.news",
                path: `/cms/news`,
                allowedRoles: ["1"],
              },
              {
                labelKey: "private_navs.cms.animal_composition",
                path: `/cms/animal-population`,
                allowedRoles: ["1"],
              },
              {
                labelKey: "private_navs.cms.faqs",
                path: `/cms/faqs`,
                allowedRoles: ["1"],
              },
            ],
          },
        ],
      },
      {
        icon: IconSchool,
        labelKey: "private_navs.kmis.index",
        path: `/kmis`,
        allowedRoles: ["1", "2"],
        subMenus: [
          {
            list: [
              {
                labelKey: "private_navs.kmis.dashboard",
                path: `/kmis/dashboard`,
                allowedRoles: ["1", "2"],
              },
              {
                labelKey: "private_navs.kmis.topic",
                path: `/kmis/topic`,
                allowedRoles: ["1"],
              },
              {
                labelKey: "private_navs.kmis.material",
                path: `/kmis/material`,
                allowedRoles: ["1", "2"],
              },
              {
                labelKey: "private_navs.kmis.quiz",
                path: `/kmis/quiz`,
                allowedRoles: ["1", "2"],
              },
              {
                labelKey: "private_navs.kmis.quiz_assessment",
                path: `/kmis/learning-progress`,
                allowedRoles: ["1", "2"],
              },
              {
                labelKey: "private_navs.kmis.educator",
                path: `/kmis/educator`,
                allowedRoles: ["1"],
              },
              {
                labelKey: "private_navs.kmis.student",
                path: `/kmis/student`,
                allowedRoles: ["1"],
              },
            ],
          },
        ],
      },
      {
        icon: IconDeviceDesktopAnalytics,
        labelKey: "private_navs.monev.index",
        path: `/monev`,
        allowedRoles: ["1", "3"],
        subMenus: [
          {
            list: [
              {
                labelKey: "private_navs.monev.dashboard",
                path: `/monev/dashboard`,
                allowedRoles: ["1", "3"],
              },
              {
                labelKey: "private_navs.monev.package_information",
                path: `/monev/package-information`,
                allowedRoles: ["1", "3"],
              },
              // {
              //   labelKey: "private_navs.monev.monitoring",
              //   path: `/monev/monitoring`,
              //   allowedRoles: ["1", "3"],
              // },
              {
                labelKey: "private_navs.monev.activity_calendar",
                path: `/monev/agenda-calendar`,
                allowedRoles: ["1", "3"],
              },
              {
                labelKey: "private_navs.monev.data_sharing",
                path: `/monev/data-sharing`,
                allowedRoles: ["1", "3"],
              },
              // {
              //   labelKey: "private_navs.monev.package_validation",
              //   path: `/monev/package-validation`,
              //   allowedRoles: ["1"],
              // },
              // {
              //   labelKey: "private_navs.monev.realization_validation",
              //   path: `/monev/realization-validation`,
              //   allowedRoles: ["1"],
              // },
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
          {
            groupLabelKey: "settings_navs.cms_master_data.index",
            allowedRoles: ["1"],
            list: [
              {
                icon: IconCategory,
                labelKey: "settings_navs.cms_master_data.activity_category",
                path: `/settings/activity-category`,
                backPath: `/settings`,
              },
              {
                icon: IconCategory,
                labelKey: "settings_navs.cms_master_data.news_category",
                path: `/settings/news-category`,
                backPath: `/settings`,
              },
              {
                icon: IconCategory,
                labelKey: "settings_navs.cms_master_data.animal_category",
                path: `/settings/animal-category`,
                backPath: `/settings`,
              },
            ],
          },
          {
            groupLabelKey: "settings_navs.kmis_master_data.index",
            allowedRoles: ["1"],
            list: [
              {
                icon: IconCategory,
                labelKey: "settings_navs.kmis_master_data.topic_category",
                path: `/settings/topic-category`,
                backPath: `/settings`,
              },
            ],
          },
          {
            groupLabelKey: "settings_navs.monev_master_data.index",
            allowedRoles: ["1"],
            list: [
              {
                icon: IconCategory,
                labelKey: "settings_navs.monev_master_data.agenda_category",
                path: `/settings/agenda-category`,
                backPath: `/settings`,
              },
              {
                icon: IconUsers,
                labelKey: "settings_navs.monev_master_data.pic_division",
                path: `/settings/pic-division`,
                backPath: `/settings`,
              },
              {
                icon: IconChecklist,
                labelKey: "settings_navs.monev_master_data.pic_assignment",
                path: `/settings/pic-assignment`,
                backPath: `/settings`,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const MASTER_DATA_NAVS = [];
