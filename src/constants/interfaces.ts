import { BtnProps } from "@/components/ui/btn";
import {
  BoxProps,
  ButtonProps,
  MenuItemProps,
  StackProps,
  TableCellProps,
  TableColumnHeaderProps,
} from "@chakra-ui/react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ReactNode } from "react";
import {
  Type__DateRange,
  Type__DateRangePresets,
  Type__DisclosureSizes,
  Type__MaterialType,
  Type__MonevContractType,
  Type__TimeRange,
} from "./types";

// Monev
export interface Interface__MonevDataSharing extends Interface__CUD {
  id: string;
  createdUser: Interface__User;
  report: Interface__StorageFile[];
  name: string;
  description: string;
}
export interface Interface__MonevAgendaCalendar {
  date: string;
  agendas: Interface__MonevAgenda[];
}
export interface Interface__MonevAgenda extends Interface__CUD {
  id: string;
  createdUser: Interface__User;
  activityCategory: Interface__MonevAgendaCategory;
  name: string;
  description: string;
  location: string;
  startedDate: string;
  finishedDate: string;
  startedTime: string;
  finishedTime: string;
}
export interface Interface__MonevRealizationAccount {
  name: string;
  value: number | null;
}
export interface Interface__MonevRealization extends Interface__CUD {
  id: string;
  validatedUser: Interface__User;
  editedUser: Interface__User;
  evidence: Interface__StorageFile[];
  month: number;
  year: number;
  budgerRealization: Interface__MonevRealizationAccount[];
  progress: number;
  description: string;
  problem: string;
  validationStatus: number; // 1 = pending, 2 = approved, 3 = rejected
  rejectionReason: string;
  validateAt: string;
}
export interface Interface__MonevRealizations extends Interface__CUD {
  monevMonthlyRealizationtOriginal: Interface__MonevTarget[];
  monevMonthlyRealizationtPendingUpdate: Interface__MonevTarget[];
}
export interface Interface__MonevTarget extends Interface__CUD {
  id: string;
  validatedUser: Interface__User;
  editedUser: Interface__User;
  month: number;
  year: number;
  budgetTarget: number;
  physicalTarget: number;
  description: string;
  validationStatus: number;
  rejectionReason: string;
  validateAt: string;
}
export interface Interface__MonevTargets extends Interface__CUD {
  monevTargetOriginal: Interface__MonevTarget[];
  monevTargetPendingUpdate: Interface__MonevTarget[];
}
export interface Interface__MonevPackageInformation extends Interface__CUD {
  id: string;
  createdUser: Interface__User;
  validatedUser: Interface__User;
  editedUser: Interface__User;
  picDivision: Interface__MonevPICDivision;
  contractType: Type__MonevContractType;
  mak: string;
  name: string;
  description: string;
  startedMonth: number;
  finishedMonth: number;
  startedYear: number;
  finishedYear: number;
  unitOutput: string;
  codeOutput: string;
  volume: string;
  pagu: number;
  partner: string;
  validationStatus: number; // 1: pending, 2: approved, 3: rejected
  rejectionReason: string;
  monevMonthlyRealization?: Interface__MonevRealization[];
  monevMonthlyRealizationPendingUpdate?: Interface__MonevRealization[];
}
export interface Interface__MonevPICDivision extends Interface__CUD {
  id: string;
  title: string;
  description: string;
  picUser?: Interface__User[];
}
export interface Interface__MonevAgendaCategory extends Interface__CUD {
  id: string;
  title: string;
  description: string;
}

// CMS
export interface Interface__CMSFAQs extends Interface__CUD {
  id: string;
  question: Interface__CMSTextContent;
  answer: Interface__CMSTextContent;
}
export interface Interface__CMSAnimalCategory extends Interface__CUD {
  id: string;
  name: Interface__CMSTextContent;
  description: Interface__CMSTextContent;
}
export interface Interface__CMSAnimalPopulation extends Interface__CUD {
  id: string;
  animalCategory: Interface__CMSAnimalCategory;
  speciesImage: Interface__StorageFile[];
  name: Interface__CMSTextContent;
  description: Interface__CMSTextContent;
  total: number;
}
export interface Interface__CMSNewsCategory extends Interface__CUD {
  id: string;
  name: Interface__CMSTextContent;
  description: Interface__CMSTextContent;
}
export interface Interface__CMSNews extends Interface__CUD {
  id: string;
  newsCategory: Interface__CMSActivityCategory;
  thumbnail: Interface__StorageFile[];
  title: Interface__CMSTextContent;
  slug: Interface__CMSTextContent;
  description: Interface__CMSTextContent;
  newsContent: Interface__CMSTextContent;
}
export interface Interface__CMSActivityCategory extends Interface__CUD {
  id: string;
  name: Interface__CMSTextContent;
  description: Interface__CMSTextContent;
}
export interface Interface__CMSActivity extends Interface__CUD {
  id: string;
  eventCategory: Interface__CMSActivityCategory;
  thumbnail: Interface__StorageFile[];
  title: Interface__CMSTextContent;
  description: Interface__CMSTextContent;
  eventContent: Interface__CMSTextContent;
}
export interface Interface__CMSLegalDocs extends Interface__CUD {
  id: string;
  title: Interface__CMSTextContent;
  description: Interface__CMSTextContent;
  document: Interface__StorageFile[];
}
export interface Interface__CMSTextContent {
  id: string;
  en: string;
}

// KMIS
export interface Interface__KMISLearningAttempt extends Interface__CUD {
  id: string;
  attemptUser: Interface__User;
  topic: Interface__KMISTopic;
  attemptStatus: number;
  assessmentStatus: boolean;
  totalMaterial: number;
  completedMaterial: number;
  completedQuiz: number;
  quizStarted: string;
  quizFinished: string;
  questionsAnswered: number;
  correctCount: number;
  wrongCount: number;
  emptyCount: number;
  scoreTotal: number;
  feedback: number | null;
  feedbackComment: string | null;
  certificate: Interface__StorageFile[];
}
export interface Interface__KMISTopic extends Interface__CUD {
  id: string;
  category: Interface__KMISTopicCategory;
  topicCover: Interface__StorageFile[];
  title: string;
  description: string;
  materialOrder?: Interface__KMISMaterial[];
  totalQuiz: number;
  quizDuration: number; // seconds
}
export interface Interface__KMISMaterial extends Interface__CUD {
  id: string;
  createdUser: Interface__User;
  uploadedUser: Interface__User;
  topic: Interface__KMISTopic;
  materialFiles: Interface__StorageFile[];
  materialCover: Interface__StorageFile[];
  title: string;
  materialType: Type__MaterialType;
  materialUrl: any;
  description: string;
  isPublic: boolean;
}
export interface Interface__KMISQuiz extends Interface__CUD {
  id: string;
  topic: Interface__KMISTopic;
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctOption: string;
  explanation: string;
}
export interface Interface__KMISQuizResponse {
  selectedOption: string;
  isMarker: boolean | number;
  isCorrect: boolean | number;
  quiz: Interface__KMISQuiz;
}
export interface Interface__KMISEducator extends Interface__CUD {
  id: string;
  user: Interface__User;
  totalMaterial: number;
}
export interface Interface__KMISStudent extends Interface__CUD {
  id: string;
  user: Interface__User;
  totalTopic: number;
  totalAttempts: number;
  totalFinished: number;
  avgScoreFinished: number;
}
export interface Interface__KMISTopicCategory extends Interface__CUD {
  id: string;
  categoryCover: Interface__StorageFile[];
  title: string;
  description: string;
}

// Auth
export interface Interface__User extends Interface__CUD {
  id: string;
  photoProfile: Interface__StorageFile[];
  name: string;
  email: string;
  role: Interface__Role;
  accountStatus: string | number;
  // optional
  gender: boolean | number | null; // 1 male, 0 female
  phoneNumber: string | null;
  birthDate: string | null;
  address: string | null;
  // audit timestamps
  registerAt: string;
  lastLogin: string | null;
  lastChangePassword: string | null;
  deactiveAt: string | null;
}
export interface Interface__Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Navs
export interface Interface__NavListItem {
  icon?: any;
  labelKey: string;
  path: string;
  backPath?: string;
  allowedRoles?: string[];
  allowedPermissions?: string[];
  subMenus?: Interface__NavItem[];
}
export interface Interface__NavItem {
  groupLabelKey?: string;
  list: Interface__NavListItem[];
  allowedRoles?: string[];
}

// Data Table
export interface Interface__DataProps {
  headers?: Interface__FormattedTableHeader[];
  rows?: Interface__FormattedTableRow[];
  rowOptions?: Interface__RowOptionsTableOptionGenerator[];
  batchOptions?: Interface__BatchOptionsTableOptionGenerator[];
}
export interface Interface__FormattedTableHeader {
  th: string;
  sortable?: boolean;
  headerProps?: TableColumnHeaderProps;
  wrapperProps?: StackProps;
  align?: string;
}
export interface Interface__FormattedTableRow<T = any> {
  id: string;
  idx: number;
  data: T;
  dim?: boolean;
  columns: {
    td: any;
    value: any;
    dataType?: string; // "string" | "number" | "date" | "time" |
    tableCellProps?: TableCellProps;
    wrapperProps?: StackProps;
    align?: string;
    dim?: boolean;
  }[];
}
export interface Interface__TableOption {
  disabled?: boolean;
  label?: string;
  icon?: any;
  onClick?: () => void;
  confirmation?: {
    id: string;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
    confirmButtonProps?: BtnProps;
    loading?: boolean;
    disabled?: boolean;
  };
  menuItemProps?: Partial<MenuItemProps>;
  override?: ReactNode;
}
export type Interface__RowOptionsTableOptionGenerator<T = any> = (
  formattedRow: Interface__FormattedTableRow<T>,
  overloads?: any
) => Interface__TableOption | null | false;
export type Interface__BatchOptionsTableOptionGenerator<T = string[]> = (
  selectedRowIds: T,
  overloads?: any
) => Interface__TableOption | null | false;

// HTTP
export interface Interface__RequestState<T = any> {
  loading: boolean;
  status: number | null;
  error: any;
  response: AxiosResponse<T> | null;
}
export interface Interface__Req<T = any> {
  config: AxiosRequestConfig;
  onResolve?: {
    onSuccess?: (r: AxiosResponse<T>) => void;
    onError?: (e: any) => void;
  };
}

// CUD
export interface Interface__CUD {
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

// Storage
export interface Interface__StorageFile extends Interface__CUD {
  id: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileMimeType: string;
  fileSize: string;
}

// Select Input
export interface Interface__SelectOption {
  id: any;
  label: any;
  label2?: any;
  original_data?: any;
  disabled?: boolean;
}

// Date Range Picker Input
export interface Interface__DateRangePicker extends ButtonProps {
  id?: string;
  name?: string;
  title?: string;
  onConfirm?: (inputValue: Type__DateRange) => void;
  inputValue?: Type__DateRange;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
  preset?: Type__DateRangePresets[];
  maxRange?: number;
}

// Time Range Picker Input
export interface Interface__TimeRangePicker extends ButtonProps {
  id?: string;
  name?: string;
  title?: string;
  onConfirm?: (inputValue: Type__TimeRange | undefined) => void;
  inputValue?: Type__TimeRange | undefined;
  withSeconds?: boolean;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  disclosureSize?: Type__DisclosureSizes;
}

// Divider
export interface Interface__Divider extends BoxProps {
  dir?: "vertical" | "horizontal";
}
