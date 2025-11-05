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
import { FileInput } from "@/components/ui/file-input";
import { NumInput } from "@/components/ui/number-input";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import { StringInput } from "@/components/ui/string-input";
import { Textarea } from "@/components/ui/textarea";
import BackButton from "@/components/widget/BackButton";
import { ClampText } from "@/components/widget/ClampText";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { DotIndicator } from "@/components/widget/Indicator";
import SimplePopover from "@/components/widget/SimplePopover";
import {
  Interface__MonevRealization,
  Interface__MonevRealizationAccount,
  Interface__MonevTargets,
} from "@/constants/interfaces";
import { L_MONTHS } from "@/constants/months";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/sizes";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useDataState from "@/hooks/useDataState";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray } from "@/utils/array";
import { getUserData } from "@/utils/auth";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { formatNumber } from "@/utils/formatter";
import { fileValidation, min1FileExist } from "@/utils/validationSchema";
import {
  Box,
  Circle,
  FieldRoot,
  HStack,
  Icon,
  InputGroup,
  SimpleGrid,
  Slider,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconCheck,
  IconCoins,
  IconExclamationMark,
  IconInfoCircle,
  IconMinus,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import * as yup from "yup";

const PREFIX_ID = "monev_package_information";

const ValidationButtons = (props: any) => {
  // Props
  const { id, validationAPI, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: id,
    loadingMessage: {
      title: `${l.validate}`,
    },
    successMessage: {
      title: `${l.validation} ${l.successful}`,
    },
  });

  // States
  const user = getUserData();
  const isSuperAdmin = user?.role?.id === "1";
  const [validationStatus, setValidationStatus] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");

  // Utils
  function onValidate() {
    back();

    const payload = {
      validationStatus: validationStatus,
      rejectionReason: rejectionReason,
    };

    const config = {
      url: validationAPI,
      method: "PATCH",
      data: payload,
    };

    req({
      config: config,
      onResolve: {
        onSuccess: () => {
          setRt((ps) => !ps);
        },
      },
    });
  }

  return (
    isSuperAdmin && (
      <HStack w={"80px"} justify={"end"} gap={1} {...restProps}>
        <ConfirmationDisclosureTrigger
          id={`${id}-reject`}
          title={l.reject}
          description={l.msg_reject_confirmation}
          confirmLabel={l.reject}
          onConfirm={onValidate}
          addonElement={
            <Field label={l.reason} mt={4}>
              <Textarea
                inputValue={rejectionReason}
                onChange={(inputValue) => {
                  setRejectionReason(inputValue);
                }}
              />
            </Field>
          }
          confirmButtonProps={{
            colorPalette: "red",
            variant: "outline",
            disabled: !!!rejectionReason,
          }}
        >
          <Btn
            iconButton
            colorPalette={"red"}
            variant={"ghost"}
            size={"sm"}
            onClick={() => {
              setValidationStatus(3);
            }}
            disabled={loading}
          >
            <Icon boxSize={5}>
              <IconX stroke={1.5} />
            </Icon>
          </Btn>
        </ConfirmationDisclosureTrigger>

        <ConfirmationDisclosureTrigger
          id={`${id}-validate`}
          title={l.validate}
          description={l.msg_validate_confirmation}
          confirmLabel={l.validate}
          onConfirm={onValidate}
        >
          <Btn
            iconButton
            colorPalette={"green"}
            variant={"ghost"}
            size={"sm"}
            onClick={() => {
              setValidationStatus(2);
            }}
            disabled={loading}
          >
            <Icon boxSize={5}>
              <IconCheck stroke={1.5} />
            </Icon>
          </Btn>
        </ConfirmationDisclosureTrigger>
      </HStack>
    )
  );
};

export const TargetInputItem = (props: any) => {
  // Props
  const { target, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: "update-target",
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      budgetTarget: null as number | null,
      physicalTarget: null as number | null,
      description: "",
    },
    validationSchema: yup.object().shape({
      budgetTarget: yup.number().required(l.msg_required_form),
      physicalTarget: yup.number().required(l.msg_required_form),
      description: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      const payload = values;
      const config = {
        url: `/api/monev/target/update/${target.id}`,
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
  const isChanged = useMemo(() => {
    return (
      target &&
      (target.budgetTarget !== formik.values.budgetTarget ||
        target.physicalTarget !== formik.values.physicalTarget ||
        target.description !== formik.values.description)
    );
  }, [formik.values, target]);

  useEffect(() => {
    formik.setValues({
      budgetTarget: target.budgetTarget,
      physicalTarget: target.physicalTarget,
      description: target.description,
    });
  }, [target]);

  return (
    <CContainer
      gap={4}
      p={4}
      pt={3}
      border={"1px solid"}
      borderColor={"border.muted"}
      rounded={themeConfig.radii.container}
      {...restProps}
    >
      <HStack justify={"space-between"}>
        <P fontSize={"lg"} fontWeight={"semibold"}>{`${
          L_MONTHS[target.month] || "Month is not 0 based"
        }`}</P>

        <P fontWeight={"medium"} color={"fg.subtle"}>{`${target.year}`}</P>
      </HStack>

      <CContainer>
        <form id={`target-${target.id}`} onSubmit={formik.handleSubmit}>
          <FieldRoot gap={4} disabled={loading}>
            <Field
              invalid={!!formik.errors.budgetTarget}
              errorText={formik.errors.budgetTarget as string}
            >
              <P color={"fg.muted"}>{l.budget_target}</P>

              <InputGroup startAddon="Rp">
                <NumInput
                  inputValue={formik.values.budgetTarget}
                  onChange={(inputValue) => {
                    formik.setFieldValue("budgetTarget", inputValue);
                  }}
                  placeholder="xxx.xxx.xxx"
                  roundedTopLeft={0}
                  roundedBottomLeft={0}
                />
              </InputGroup>
            </Field>

            <Field
              invalid={!!formik.errors.physicalTarget}
              errorText={formik.errors.physicalTarget as string}
            >
              <P color={"fg.muted"}>{l.physical_target}</P>

              <InputGroup endAddon="%">
                <NumInput
                  inputValue={formik.values.physicalTarget}
                  onChange={(inputValue) => {
                    formik.setFieldValue("physicalTarget", inputValue);
                  }}
                  max={100}
                  roundedTopRight={0}
                  roundedBottomRight={0}
                  placeholder="xxx"
                />
              </InputGroup>
            </Field>

            <Field
              invalid={!!formik.errors.description}
              errorText={formik.errors.description as string}
            >
              <P color={"fg.muted"}>{l.description}</P>

              <Textarea
                inputValue={formik.values.description}
                onChange={(inputValue) => {
                  formik.setFieldValue("description", inputValue);
                }}
              />
            </Field>
          </FieldRoot>

          <HStack>
            <Btn
              type="submit"
              w={"fit"}
              ml={"auto"}
              mt={4}
              colorPalette={themeConfig.colorPalette}
              variant={"outline"}
              disabled={
                !isChanged ||
                !formik.values.budgetTarget ||
                !formik.values.physicalTarget ||
                !formik.values.description
              }
              loading={loading}
            >
              {l.save}
            </Btn>
          </HStack>
        </form>
      </CContainer>
    </CContainer>
  );
};
export const TargetListDisclosure = (props: any) => {
  // Props
  const { open, data } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const {
    error,
    initialLoading,
    data: targetData,
    onRetry,
  } = useDataState<Interface__MonevTargets>({
    initialData: undefined,
    url: `/api/monev/target/${data.id}`,
    conditions: open,
    dependencies: [open],
    dataResource: false,
    withLoadingBar: false,
  });
  const currentTargetData = targetData?.monevTargetOriginal;
  const pendingTargetData = targetData?.monevTargetPendingUpdate;

  const render = {
    loading: <Skeleton flex={1} minH={MIN_H_FEEDBACK_CONTAINER} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    loaded: (
      <CContainer gap={4} mt={-2}>
        <Tabs.Root lazyMount unmountOnExit defaultValue="tab-1">
          <Tabs.List>
            <Tabs.Trigger value="tab-1">{l.current_data}</Tabs.Trigger>

            <Tabs.Trigger value="tab-2">
              {l.unvalidated}{" "}
              {!isEmptyArray(pendingTargetData) && <DotIndicator ml={1} />}
            </Tabs.Trigger>
          </Tabs.List>

          <>
            <Tabs.Content value="tab-1">
              <>
                {isEmptyArray(currentTargetData) && <FeedbackNoData />}

                {!isEmptyArray(currentTargetData) && (
                  <SimpleGrid columns={[1, null, 2]} gap={4}>
                    {currentTargetData?.map((target) => {
                      return (
                        <TargetInputItem key={target.id} target={target} />
                      );
                    })}
                  </SimpleGrid>
                )}
              </>
            </Tabs.Content>

            <Tabs.Content value="tab-2">
              <>
                {isEmptyArray(pendingTargetData) && <FeedbackNoData />}

                {!isEmptyArray(pendingTargetData) && (
                  <CContainer gap={2}>
                    <HStack gap={4} px={2} color={"fg.muted"}>
                      <P w={"140px"} ml={2}>
                        {l.period}
                      </P>
                      <P flex={2} textAlign={"right"}>
                        {l.budget_target}
                      </P>
                      <P flex={2} textAlign={"right"}>
                        {l.physical_target}
                      </P>

                      <Box w={"80px"} h={"30px"} ml={8} />
                    </HStack>

                    {pendingTargetData?.map((target) => {
                      return (
                        <HStack
                          key={target.id}
                          p={2}
                          rounded={themeConfig.radii.component}
                          border={"1px solid"}
                          borderColor={"border.muted"}
                          gap={4}
                        >
                          <HStack w={"140px"} ml={2}>
                            <ClampText>{`${L_MONTHS[target.month]} ${
                              target?.year
                            }`}</ClampText>

                            <SimplePopover
                              content={<P>{`${target.description || "-"}`}</P>}
                            >
                              <Btn
                                iconButton
                                size={"2xs"}
                                rounded={"full"}
                                variant={"ghost"}
                              >
                                <Icon boxSize={5}>
                                  <IconInfoCircle stroke={1.5} />
                                </Icon>
                              </Btn>
                            </SimplePopover>
                          </HStack>

                          <P flex={2} textAlign={"right"}>{`${
                            target?.budgetTarget
                              ? `Rp ${formatNumber(target?.budgetTarget)}`
                              : "-"
                          }`}</P>

                          <P flex={2} textAlign={"right"}>{`${
                            target?.physicalTarget
                              ? `${target?.physicalTarget}%`
                              : "-"
                          }`}</P>

                          <ValidationButtons
                            id={`validate-target-${target.id}`}
                            validationAPI={`/api/monev/target/verification/${target.id}`}
                            ml={8}
                          />
                        </HStack>
                      );
                    })}
                  </CContainer>
                )}
              </>
            </Tabs.Content>
          </>
        </Tabs.Root>
      </CContainer>
    ),
  };

  return (
    <DisclosureRoot open={open} lazyLoad size={"lg"}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent title={`Target`} />
        </DisclosureHeader>

        <DisclosureBody>
          {initialLoading && render.loading}
          {!initialLoading && (
            <>
              {error && render.error}
              {!error && (
                <>
                  {targetData && render.loaded}
                  {(!targetData ||
                    isEmptyArray(targetData?.monevTargetOriginal)) &&
                    render.empty}
                </>
              )}
            </>
          )}
        </DisclosureBody>

        <DisclosureFooter>
          <BackButton />
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};
export const TargetListDisclosureTrigger = (props: any) => {
  // Props
  const { id, data, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    disclosureId(id || `${PREFIX_ID}-target-${data?.id}`),
    open,
    onOpen,
    onClose
  );

  return (
    <>
      <CContainer onClick={onOpen} {...restProps}></CContainer>

      <TargetListDisclosure open={open} data={data} />
    </>
  );
};

export const RealizationItemIcon = (props: any) => {
  // Props
  const { status, containerP, ...restProps } = props;

  switch (status) {
    case "1":
      return (
        <Circle w={"fit"} aspectRatio={1} p={containerP || 1} bg={"orange.400"}>
          <Icon color={"body"} {...restProps}>
            <IconExclamationMark
            // stroke={1.5}
            />
          </Icon>
        </Circle>
      );
    case "2":
      return (
        <Circle w={"fit"} aspectRatio={1} p={containerP || 1} bg={"fg.success"}>
          <Icon color={"body"} {...restProps}>
            <IconCheck
            // stroke={1.5}
            />
          </Icon>
        </Circle>
      );
    case "3":
      return (
        <Circle w={"fit"} aspectRatio={1} p={containerP || 1} bg={"fg.error"}>
          <Icon color={"body"} {...restProps}>
            <IconX
            // stroke={1.5}
            />
          </Icon>
        </Circle>
      );
    default:
      return (
        <Circle w={"fit"} aspectRatio={1} p={containerP || 1} bg={"d2"}>
          <Icon color={"current"} {...restProps}>
            <IconMinus
            // stroke={1.5}
            />
          </Icon>
        </Circle>
      );
  }
};
export const RealizationDisclosure = (props: any) => {
  // Props
  const { realization, open } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: "update-realization",
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      budgetRealization: [
        {
          name: "",
          value: null,
        },
      ] as Interface__MonevRealizationAccount[],
      progress: [40] as number[],
      description: "",
      problem: "",
      files: null as any,
      deleteDocumentIds: [] as string[],
    },
    validationSchema: yup.object().shape({
      budgetRealization: yup.array().required(l.msg_required_form),
      progress: yup.array().required(l.msg_required_form),
      description: yup.string().required(l.msg_required_form),
      problem: yup.string().required(l.msg_required_form),
      files: fileValidation({
        allowedExtensions: ["pdf", "png", "jpeg", "jpg", "zip"],
      }).concat(
        min1FileExist({
          resolvedData: realization,
          existingKey: "evidence",
          deletedKey: "deleteDocumentIds",
          newKey: "files",
          message: l.msg_required_form,
        })
      ),
    }),
    onSubmit: (values) => {
      back();

      const payload = new FormData();
      if (!isEmptyArray(values.files)) payload.append("files", values.files[0]);
      payload.append(
        "budgetRealization",
        JSON.stringify(values.budgetRealization)
      );
      payload.append("progress", JSON.stringify(values.progress[0]));
      payload.append("description", values.description);
      payload.append("problem", values.problem);
      payload.append(
        "deleteDocumentIds",
        JSON.stringify(values.deleteDocumentIds)
      );

      const config = {
        url: `/api/monev/monthly-realization/update/${realization?.id}`,
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
      budgetRealization: isEmptyArray(realization?.budgetRealization)
        ? [
            {
              name: "",
              value: null,
            },
          ]
        : realization?.budgetRealization,
      progress: [realization?.progress],
      description: realization?.description,
      problem: realization?.problem,
      files: [],
      deleteDocumentIds: [],
    });
  }, [realization]);

  return (
    <DisclosureRoot open={open} lazyLoad size={"lg"}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent title={`Input ${l.realization}`} />
        </DisclosureHeader>

        <DisclosureBody>
          <form
            id={`update-realization-${realization?.id}`}
            onSubmit={formik.handleSubmit}
          >
            <FieldRoot disabled={loading} gap={4}>
              <CContainer gap={4}>
                <P fontSize={"lg"} fontWeight={"semibold"}>
                  {l.input_realization_budget_title}
                </P>

                <Field
                  label={l.budget_realization}
                  invalid={!!formik.errors.files}
                  errorText={formik.errors.files as string}
                >
                  <CContainer gap={2}>
                    {formik.values.budgetRealization.map((item, idx) => {
                      return (
                        <HStack key={idx}>
                          <StringInput
                            inputValue={item?.name}
                            onChange={(inputValue) => {
                              const updated = [
                                ...formik.values.budgetRealization,
                              ];
                              updated[idx].name = inputValue;
                              formik.setFieldValue(
                                "budgetRealization",
                                updated
                              );
                            }}
                            flex={3}
                            placeholder={l.expenditure_realization_account}
                          />
                          <NumInput
                            inputValue={item?.value}
                            onChange={(inputValue) => {
                              const updated = [
                                ...formik.values.budgetRealization,
                              ];
                              updated[idx].value = inputValue;
                              formik.setFieldValue(
                                "budgetRealization",
                                updated
                              );
                            }}
                            flex={2}
                            placeholder="Nominal"
                          />

                          <Btn
                            iconButton
                            variant={"outline"}
                            size={"md"}
                            onClick={() => {
                              formik.setFieldValue("budgetRealization", [
                                ...formik.values.budgetRealization.filter(
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
                        formik.values.budgetRealization.length > 0
                          ? "ghost"
                          : "outline"
                      }
                      w={
                        formik.values.budgetRealization.length > 0
                          ? "fit"
                          : "full"
                      }
                      ml={"auto"}
                      pl={3}
                      size={"md"}
                      onClick={() => {
                        formik.setFieldValue("budgetRealization", [
                          ...formik.values.budgetRealization,
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
              </CContainer>

              <CContainer gap={4}>
                <P fontSize={"lg"} fontWeight={"semibold"}>
                  {l.input_realization_physical_title}
                </P>

                <Field
                  invalid={!!formik.errors.progress}
                  errorText={formik.errors.progress as string}
                >
                  <Slider.Root
                    w={"full"}
                    size="sm"
                    value={formik.values.progress}
                    onValueChange={(e) =>
                      formik.setFieldValue("progress", e.value)
                    }
                  >
                    <HStack justify="space-between" mb={2}>
                      <P flexShrink={0} fontWeight={"medium"}>
                        {l.progress}
                      </P>

                      <InputGroup endAddon={"%"} w={"fit"}>
                        <NumInput
                          inputValue={formik.values.progress[0]}
                          onChange={(inputValue) => {
                            formik.setFieldValue("progress", [inputValue]);
                          }}
                          max={100}
                          roundedTopRight={0}
                          roundedBottomRight={0}
                          w={"82px"}
                          placeholder="xxx"
                        />
                      </InputGroup>
                    </HStack>

                    <Slider.Control>
                      <Slider.Track>
                        <Slider.Range />
                      </Slider.Track>
                      <Slider.Thumbs />
                    </Slider.Control>
                  </Slider.Root>
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

                <Field
                  label={l.problem}
                  invalid={!!formik.errors.problem}
                  errorText={formik.errors.problem as string}
                >
                  <Textarea
                    inputValue={formik.values.problem}
                    onChange={(inputValue) => {
                      formik.setFieldValue("problem", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.evidence}
                  invalid={!!formik.errors.files}
                  errorText={formik.errors.files as string}
                >
                  <FileInput
                    dropzone
                    inputValue={formik.values.files}
                    onChange={(inputValue) => {
                      formik.setFieldValue("files", inputValue);
                    }}
                    accept="application/pdf, image/png, image/jpeg, image/jpg, .zip"
                    acceptPlaceholder=".pdf, .png, .jpg, .jpeg, .zip"
                    existingFiles={realization?.evidence}
                    onDeleteFile={(fileData) => {
                      formik.setFieldValue(
                        "deleteDocumentIds",
                        Array.from(
                          new Set([
                            ...formik.values.deleteDocumentIds,
                            fileData.id,
                          ])
                        )
                      );
                    }}
                    onUndoDeleteFile={(fileData) => {
                      formik.setFieldValue(
                        "deleteDocumentIds",
                        formik.values.deleteDocumentIds.filter(
                          (id: string) => id !== fileData.id
                        )
                      );
                    }}
                  />
                </Field>
              </CContainer>
            </FieldRoot>
          </form>
        </DisclosureBody>

        <DisclosureFooter>
          <Btn
            type="submit"
            form={`update-realization-${realization?.id}`}
            colorPalette={themeConfig.colorPalette}
          >
            {l.save}
          </Btn>
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};
export const RealizationDisclosureTrigger = (props: any) => {
  // Props
  const { realization, children, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    disclosureId(`input-realization-${realization.id}`),
    open,
    onOpen,
    onClose
  );

  return (
    <>
      <CContainer onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <RealizationDisclosure open={open} realization={realization} />
    </>
  );
};
export const RealizationItem = (props: any) => {
  // Props
  const { realization, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer
      gap={2}
      p={2}
      pt={4}
      border={"1px solid"}
      borderColor={"border.muted"}
      rounded={themeConfig.radii.component}
      align={"center"}
      {...restProps}
    >
      <RealizationItemIcon status={`${realization?.validationStatus}`} />

      <P fontWeight={"medium"} mt={2}>{`${
        L_MONTHS[realization.month] || "Month is not 0 based"
      } ${realization.year}`}</P>

      <RealizationDisclosureTrigger realization={realization}>
        <Btn
          variant={"ghost"}
          colorPalette={themeConfig.colorPalette}
          size={"xs"}
          w={"full"}
        >{`Input ${l.realization}`}</Btn>
      </RealizationDisclosureTrigger>
    </CContainer>
  );
};
const BudgetRealization = (props: any) => {
  // Props
  const { id, budgetRealization, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(id), open, onOpen, onClose);

  return (
    <>
      <Btn variant={"ghost"} size={"md"} onClick={onOpen} {...restProps}>
        <Icon>
          <IconCoins stroke={1.5} />
        </Icon>

        {l.budget_realization}
      </Btn>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${l.budget_realization}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <CContainer gap={2}>
              {isEmptyArray(budgetRealization) && <FeedbackNoData />}

              {budgetRealization?.map(
                (budget: Interface__MonevRealizationAccount, idx: number) => {
                  return (
                    <HStack key={idx} gap={4}>
                      <ClampText w={"fit"}>{budget?.name}</ClampText>

                      <Box flex={1} h={"1px"} bg={"border.muted"} />

                      <P flexShrink={0} textAlign={"right"}>
                        {formatNumber(budget?.value)}
                      </P>
                    </HStack>
                  );
                }
              )}
            </CContainer>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
export const RealizationList = (props: any) => {
  // Props
  const { data, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const monthlyRealization = data?.monthlyRealization;
  const currentMonthlyRealizations: Interface__MonevRealization[] =
    monthlyRealization?.monevMonthlyRealizationOriginal;
  const pendingUpdateMonthlyRealizations: Interface__MonevRealization[] =
    monthlyRealization?.monevMonthlyRealizationPendingUpdate;

  return (
    <CContainer gap={4} mt={-2}>
      <Tabs.Root lazyMount unmountOnExit defaultValue="tab-1">
        <Tabs.List>
          <Tabs.Trigger value="tab-1">{l.current_data}</Tabs.Trigger>

          <Tabs.Trigger value="tab-2">
            {l.unvalidated}{" "}
            {!isEmptyArray(pendingUpdateMonthlyRealizations) && (
              <DotIndicator ml={1} />
            )}
          </Tabs.Trigger>
        </Tabs.List>

        <>
          <Tabs.Content value="tab-1">
            <>
              {isEmptyArray(currentMonthlyRealizations) && <FeedbackNoData />}

              {!isEmptyArray(currentMonthlyRealizations) && (
                <>
                  <SimpleGrid columns={[2, 3, 4]} gap={4} {...restProps}>
                    {currentMonthlyRealizations?.map(
                      (realization: Interface__MonevRealization) => {
                        return (
                          <RealizationItem
                            key={realization?.id}
                            realization={realization}
                          />
                        );
                      }
                    )}
                  </SimpleGrid>

                  <HStack wrap={"wrap"} gap={4} mt={8}>
                    <HStack>
                      <RealizationItemIcon
                        status={"4"}
                        boxSize={3}
                        containerP={"2px"}
                      />

                      <P>{l.uninputted}</P>
                    </HStack>

                    <HStack>
                      <RealizationItemIcon
                        status={"1"}
                        boxSize={3}
                        containerP={"2px"}
                      />

                      <P>{l.unvalidated}</P>
                    </HStack>

                    <HStack>
                      <RealizationItemIcon
                        status={"3"}
                        boxSize={3}
                        containerP={"2px"}
                      />

                      <P>{l.rejected}</P>
                    </HStack>

                    <HStack>
                      <RealizationItemIcon
                        status={"2"}
                        boxSize={3}
                        containerP={"2px"}
                      />

                      <P>{l.validated}</P>
                    </HStack>
                  </HStack>
                </>
              )}
            </>
          </Tabs.Content>

          <Tabs.Content value="tab-2">
            <>
              {isEmptyArray(pendingUpdateMonthlyRealizations) && (
                <FeedbackNoData />
              )}

              {!isEmptyArray(pendingUpdateMonthlyRealizations) && (
                <CContainer gap={2}>
                  <HStack gap={4} px={2} color={"fg.muted"}>
                    <P w={"140px"} ml={2}>
                      {l.period}
                    </P>
                    <P w={"170px"} pl={4}>
                      {l.budget_target}
                    </P>
                    <P flex={1}>{l.progress}</P>

                    <Box w={"80px"} h={"30px"} ml={8} />
                  </HStack>

                  {pendingUpdateMonthlyRealizations?.map((realization) => {
                    return (
                      <HStack
                        key={realization.id}
                        p={2}
                        rounded={themeConfig.radii.component}
                        border={"1px solid"}
                        borderColor={"border.muted"}
                        gap={4}
                      >
                        <HStack w={"140px"} ml={2}>
                          <ClampText>{`${L_MONTHS[realization.month]} ${
                            realization?.year
                          }`}</ClampText>

                          <SimplePopover
                            content={
                              <P>{`${realization.description || "-"}`}</P>
                            }
                          >
                            <Btn
                              iconButton
                              size={"2xs"}
                              rounded={"full"}
                              variant={"ghost"}
                            >
                              <Icon boxSize={5}>
                                <IconInfoCircle stroke={1.5} />
                              </Icon>
                            </Btn>
                          </SimplePopover>
                        </HStack>

                        {realization?.budgetRealization ? (
                          <BudgetRealization
                            id={`budget-realization-${realization.id}`}
                            budgetRealization={realization?.budgetRealization}
                            w={"170px"}
                          />
                        ) : (
                          <P w={"170px"}>{"-"}</P>
                        )}

                        <P flex={1}>
                          {realization?.progress
                            ? `${realization?.progress}%`
                            : "-"}
                        </P>

                        <ValidationButtons
                          id={`validate-realization-${realization.id}`}
                          validationAPI={`/api/monev/monthly-realization/verification/${realization.id}`}
                          ml={8}
                        />
                      </HStack>
                    );
                  })}
                </CContainer>
              )}
            </>
          </Tabs.Content>
        </>
      </Tabs.Root>
    </CContainer>
  );
};
export const RealizationListDisclosure = (props: any) => {
  // Props
  const { open, data } = props;

  // Contexts
  const { l } = useLang();

  return (
    <DisclosureRoot open={open} lazyLoad size={"lg"}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent title={`${l.realization}`} />
        </DisclosureHeader>

        <DisclosureBody pt={2}>
          <CContainer gap={4}>
            <RealizationList data={data} />
          </CContainer>
        </DisclosureBody>

        <DisclosureFooter>
          <BackButton />
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};
export const RealizationListDisclosureTrigger = (props: any) => {
  // Props
  const { data, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    disclosureId(`${PREFIX_ID}-${data?.id}`),
    open,
    onOpen,
    onClose
  );

  return (
    <>
      <CContainer onClick={onOpen} {...restProps}></CContainer>

      <RealizationListDisclosure open={open} data={data} />
    </>
  );
};
