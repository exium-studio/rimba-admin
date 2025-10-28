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
import { StringInput } from "@/components/ui/string-input";
import { Textarea } from "@/components/ui/textarea";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useRequest from "@/hooks/useRequest";
import { back } from "@/utils/client";
import { capitalize } from "@/utils/string";
import { FieldsetRoot, InputGroup, useDisclosure } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";

const BASE_ENDPOINT = "/api/master-data/pic-division";
const PREFIX_ID = "cms_pic_division";

export const CreateMonevPICDivisionDisclosure = (props: any) => {
  const ID = `${PREFIX_ID}_create`;

  // Props
  const { open } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);
  const routeTitle = l.settings_navs.master_data.pic_division;

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${l.add} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${l.add} ${routeTitle} ${l.successful}`),
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      titleId: "",
      titleEn: "",
      descriptionId: "",
      descriptionEn: "",
    },
    validationSchema: yup.object().shape({
      titleId: yup.string().required(l.msg_required_form),
      titleEn: yup.string().required(l.msg_required_form),
      descriptionId: yup.string().required(l.msg_required_form),
      descriptionEn: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      const payload = new FormData();
      payload.append(
        "title",
        JSON.stringify({
          id: values.titleId,
          en: values.titleEn,
        })
      );
      payload.append(
        "description",
        JSON.stringify({
          id: values.descriptionId,
          en: values.descriptionEn,
        })
      );

      const config = {
        url: `${BASE_ENDPOINT}/create`,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            setRt((ps) => !ps);
            back();
            resetForm();
          },
        },
      });
    },
  });

  return (
    <DisclosureRoot open={open} lazyLoad size={"xs"}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent title={`${l.add} ${routeTitle}`} />
        </DisclosureHeader>

        <DisclosureBody>
          <form id={ID} onSubmit={formik.handleSubmit}>
            <FieldsetRoot disabled={loading}>
              <Field
                label={l.title}
                invalid={!!(formik.errors.titleId || formik.errors.titleEn)}
                errorText={
                  (formik.errors.titleId || formik.errors.titleEn) as string
                }
              >
                <InputGroup
                  startElement="id"
                  startElementProps={{ fontSize: "md", fontWeight: "medium" }}
                >
                  <StringInput
                    inputValue={formik.values.titleId}
                    onChange={(inputValue) => {
                      formik.setFieldValue("titleId", inputValue);
                    }}
                  />
                </InputGroup>
                <InputGroup
                  startElement="en"
                  startElementProps={{ fontSize: "md", fontWeight: "medium" }}
                >
                  <StringInput
                    inputValue={formik.values.titleEn}
                    onChange={(inputValue) => {
                      formik.setFieldValue("titleEn", inputValue);
                    }}
                  />
                </InputGroup>
              </Field>

              <Field
                label={l.description}
                invalid={
                  !!(formik.errors.descriptionId || formik.errors.descriptionEn)
                }
                errorText={
                  (formik.errors.descriptionId ||
                    formik.errors.descriptionEn) as string
                }
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
                    inputValue={formik.values.descriptionId}
                    onChange={(inputValue) => {
                      formik.setFieldValue("descriptionId", inputValue);
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
                    inputValue={formik.values.descriptionEn}
                    onChange={(inputValue) => {
                      formik.setFieldValue("descriptionEn", inputValue);
                    }}
                    pl={"40px !important"}
                  />
                </InputGroup>
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
            {l.add}
          </Btn>
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};

export const CreateMonevPICDivisionDisclosureTrigger = (props: any) => {
  // Props
  const { children, id, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(id || `create-monev-pic-division`, open, onOpen, onClose);
  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <CreateMonevPICDivisionDisclosure open={open} />
    </>
  );
};
