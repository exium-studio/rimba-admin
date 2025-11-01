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
import { FieldsetRoot, useDisclosure } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";

const BASE_ENDPOINT = "/api/master-data/activity-category";
const PREFIX_ID = "cms_activity_category";

export const CreateMonevAgendaCategoryDisclosure = (props: any) => {
  const ID = `${PREFIX_ID}_create`;

  // Props
  const { open } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);
  const routeTitle = l.settings_navs.master_data.agenda_category;

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
      title: "",
      description: "",
    },
    validationSchema: yup.object().shape({
      title: yup.string().required(l.msg_required_form),
      description: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      const config = {
        url: `${BASE_ENDPOINT}/create`,
        method: "POST",
        data: values,
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
                label={l.name}
                invalid={!!formik.errors.title}
                errorText={formik.errors.title as string}
              >
                <StringInput
                  inputValue={formik.values.title}
                  onChange={(inputValue) => {
                    formik.setFieldValue("title", inputValue);
                  }}
                />
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

export const CreateMonevAgendaCategoryDisclosureTrigger = (props: any) => {
  // Props
  const { children, id, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(id || `create-monev-agenda-category`, open, onOpen, onClose);
  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <CreateMonevAgendaCategoryDisclosure open={open} />
    </>
  );
};
