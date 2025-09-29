"use client";

import { Field } from "@/components/ui/field";
import { NavLink } from "@/components/ui/nav-link";
import Logo from "@/components/widget/Logo";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useRequest from "@/hooks/useRequest";
import { back, setStorage } from "@/utils/client";
import { pluckString } from "@/utils/string";
import {
  Badge,
  HStack,
  Icon,
  InputGroup,
  SimpleGrid,
  StackProps,
} from "@chakra-ui/react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBook2,
  IconDeviceDesktopAnalytics,
  IconLock,
  IconUser,
  IconUserCog,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import * as yup from "yup";
import { Btn } from "../ui/btn";
import { CContainer } from "../ui/c-container";
import { Divider } from "../ui/divider";
import { P } from "../ui/p";
import { PasswordInput } from "../ui/password-input";
import { StringInput } from "../ui/string-input";
import ResetPasswordDisclosure from "./ResetPasswordDisclosure";
import { DotIndicator } from "@/components/widget/Indicator";

interface Props extends StackProps {}

const SSOAuthForm = (props: any) => {
  // Props
  const { indexRoute, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setAuthToken = useAuthMiddleware((s) => s.setAuthToken);
  const setPermissions = useAuthMiddleware((s) => s.setPermissions);

  // Hooks
  const router = useRouter();
  const { req, loading } = useRequest({
    id: "signin",
    loadingMessage: l.loading_signin,
    successMessage: l.success_signin,
    errorMessage: {
      400: {
        INVALID_CREDENTIALS: {
          ...l.error_signin_wrong_credentials,
        },
      },
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      identifier: yup.string().required(l.msg_required_form),
      password: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      const payload = {
        email: values.identifier,
        password: values.password,
      };
      const config = {
        method: "post",
        url: "/api/signin",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: (r: any) => {
            setStorage("__auth_token", r.data.data?.token);
            setStorage("__user_data", JSON.stringify(r.data.data?.user));
            setAuthToken(r.data.data?.token);
            setPermissions(r.data.data?.permissions);
            router.push("/demo");
          },
        },
      });
    },
  });

  return (
    <CContainer {...restProps}>
      <form id="signin_form" onSubmit={formik.handleSubmit}>
        <Field
          invalid={!!formik.errors.identifier}
          errorText={formik.errors.identifier as string}
          mb={4}
        >
          <InputGroup
            w={"full"}
            startElement={
              <Icon boxSize={5}>
                <IconUser stroke={1.5} />
              </Icon>
            }
          >
            <StringInput
              name="identifier"
              onChange={(input) => {
                formik.setFieldValue("identifier", input);
              }}
              inputValue={formik.values.identifier}
              placeholder="Email/Username"
              pl={"40px !important"}
            />
          </InputGroup>
        </Field>

        <Field
          invalid={!!formik.errors.password}
          errorText={formik.errors.password as string}
        >
          <InputGroup
            w={"full"}
            startElement={
              <Icon boxSize={5}>
                <IconLock stroke={1.5} />
              </Icon>
            }
          >
            <PasswordInput
              name="password"
              onChange={(input) => {
                formik.setFieldValue("password", input);
              }}
              inputValue={formik.values.password}
              placeholder="Password"
              pl={"40px !important"}
            />
          </InputGroup>
        </Field>

        <Btn
          type="submit"
          form="signin_form"
          w={"full"}
          mt={6}
          size={"lg"}
          loading={loading}
          colorPalette={themeConfig.colorPalette}
        >
          Sign in
        </Btn>

        <HStack mt={4}>
          <Divider h={"1px"} w={"full"} />

          <ResetPasswordDisclosure>
            <Btn variant={"ghost"} color={themeConfig.primaryColor}>
              Reset Password
            </Btn>
          </ResetPasswordDisclosure>

          <Divider h={"1px"} w={"full"} />
        </HStack>
      </form>
    </CContainer>
  );
};
const BasicAuthForm = (props: any) => {
  // Props
  const { indexRoute, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setAuthToken = useAuthMiddleware((s) => s.setAuthToken);
  const setPermissions = useAuthMiddleware((s) => s.setPermissions);

  // Hooks
  const router = useRouter();
  const { req, loading } = useRequest({
    id: "signin",
    loadingMessage: l.loading_signin,
    successMessage: l.success_signin,
    errorMessage: {
      400: {
        INVALID_CREDENTIALS: {
          ...l.error_signin_wrong_credentials,
        },
      },
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      identifier: yup.string().required(l.msg_required_form),
      password: yup.string().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      const payload = {
        email: values.identifier,
        password: values.password,
      };
      const config = {
        method: "post",
        url: "/api/signin",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: (r: any) => {
            setStorage("__auth_token", r.data.data?.token);
            setStorage("__user_data", JSON.stringify(r.data.data?.user));
            setAuthToken(r.data.data?.token);
            setPermissions(r.data.data?.permissions);
            router.push("/demo");
          },
        },
      });
    },
  });

  return (
    <CContainer {...restProps}>
      <form id="signin_form" onSubmit={formik.handleSubmit}>
        <Field
          invalid={!!formik.errors.identifier}
          errorText={formik.errors.identifier as string}
          mb={4}
        >
          <InputGroup
            w={"full"}
            startElement={
              <Icon boxSize={5}>
                <IconUser stroke={1.5} />
              </Icon>
            }
          >
            <StringInput
              name="identifier"
              onChange={(input) => {
                formik.setFieldValue("identifier", input);
              }}
              inputValue={formik.values.identifier}
              placeholder="Email/Username"
              pl={"40px !important"}
            />
          </InputGroup>
        </Field>

        <Field
          invalid={!!formik.errors.password}
          errorText={formik.errors.password as string}
        >
          <InputGroup
            w={"full"}
            startElement={
              <Icon boxSize={5}>
                <IconLock stroke={1.5} />
              </Icon>
            }
          >
            <PasswordInput
              name="password"
              onChange={(input) => {
                formik.setFieldValue("password", input);
              }}
              inputValue={formik.values.password}
              placeholder="Password"
              pl={"40px !important"}
            />
          </InputGroup>
        </Field>

        <Btn
          type="submit"
          form="signin_form"
          w={"full"}
          mt={6}
          size={"lg"}
          loading={loading}
          colorPalette={themeConfig.colorPalette}
        >
          Sign in
        </Btn>

        <HStack mt={4}>
          <Divider h={"1px"} w={"full"} />

          <ResetPasswordDisclosure>
            <Btn variant={"ghost"} color={themeConfig.primaryColor}>
              Reset Password
            </Btn>
          </ResetPasswordDisclosure>

          <Divider h={"1px"} w={"full"} />
        </HStack>
      </form>
    </CContainer>
  );
};

const SigninForm = (props: Props) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const searchParams = useSearchParams();
  const activeRoleKey = searchParams.get("roleKey");

  // States
  const ROLES = [
    {
      icon: IconUserCog,
      key: "super_admin",
      indexRoute: "/cms/static-contents",
      sso: true,
      msg: l.msg_signin_as_super_admin,
      form: <SSOAuthForm />,
    },
    {
      icon: IconDeviceDesktopAnalytics,
      key: "monev",
      indexRoute: "/monev/dashboard",
      sso: true,
      msg: l.msg_signin_as_monev,
      form: <SSOAuthForm />,
    },
    {
      icon: IconBook2,
      key: "educator",
      indexRoute: "/kmis/dashboard",
      sso: false,
      msg: l.msg_signin_as_educator,
      form: <BasicAuthForm />,
    },
  ];
  const [selectedRoleKey, setSelectedRoleKey] = useState<string | null>(null);
  const selectedRole = ROLES.find((role) => role.key === activeRoleKey);
  const signinForm = selectedRole?.form;
  const msg = selectedRole?.msg;

  return (
    <CContainer
      w={"full"}
      m={"auto"}
      gap={8}
      rounded={themeConfig.radii.container}
      {...restProps}
    >
      <CContainer gap={1}>
        <Logo mb={4} />

        <P fontWeight={"bold"} fontSize={"xl"}>
          {l.msg_signin_title}
        </P>

        <P>{activeRoleKey ? msg : l.msg_signin}</P>
      </CContainer>

      {!activeRoleKey && (
        <>
          <SimpleGrid columns={[1, null, 3]} h={"calc(276px - 72px)"} gap={4}>
            {ROLES.map((role) => {
              const isActive = selectedRoleKey === role.key;

              return (
                <CContainer
                  key={role.key}
                  gap={2}
                  p={4}
                  color={isActive ? themeConfig.primaryColor : ""}
                  border={"1px solid"}
                  borderColor={"border.muted"}
                  rounded={themeConfig.radii.container}
                  opacity={isActive ? 1 : 0.6}
                  cursor={"pointer"}
                  pos={"relative"}
                  overflow={"clip"}
                  transition={"200ms"}
                  onClick={() => {
                    setSelectedRoleKey(role.key);
                  }}
                >
                  {isActive && <DotIndicator ml={0} />}

                  <Icon
                    boxSize={"100px"}
                    pos={"absolute"}
                    right={-4}
                    top={0}
                    opacity={0.4}
                  >
                    <role.icon stroke={1} />
                  </Icon>

                  <P fontSize={"lg"} fontWeight={"semibold"} mt={"auto"}>
                    {pluckString(l, role.key)}
                  </P>

                  <Badge
                    w={"fit"}
                    colorPalette={isActive ? themeConfig.colorPalette : ""}
                    visibility={role.sso ? "visible" : "hidden"}
                  >
                    SSO
                  </Badge>
                </CContainer>
              );
            })}
          </SimpleGrid>

          <NavLink to={`/?roleKey=${selectedRoleKey}`}>
            <Btn
              colorPalette={themeConfig.colorPalette}
              disabled={!selectedRoleKey}
            >
              {l.next}

              <Icon>
                <IconArrowRight stroke={1.5} />
              </Icon>
            </Btn>
          </NavLink>
        </>
      )}

      {activeRoleKey && (
        <CContainer gap={4} mx={"auto"}>
          <HStack>
            <Btn size={"md"} variant={"ghost"} onClick={back} pl={3}>
              <Icon>
                <IconArrowLeft stroke={1.5} />
              </Icon>

              {l.previous}
            </Btn>
          </HStack>

          {signinForm}
        </CContainer>
      )}
    </CContainer>
  );
};

export default SigninForm;
