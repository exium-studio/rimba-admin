"use client";

import { Avatar } from "@/components/ui/avatar";
import { Field } from "@/components/ui/field";
import { NavLink } from "@/components/ui/nav-link";
import { DotIndicator } from "@/components/widget/Indicator";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useRequest from "@/hooks/useRequest";
import { getUserData } from "@/utils/auth";
import { back, removeStorage, setStorage } from "@/utils/client";
import { pluckString } from "@/utils/string";
import {
  Badge,
  HStack,
  Icon,
  InputGroup,
  SimpleGrid,
  StackProps,
  VStack,
} from "@chakra-ui/react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconChalkboardTeacher,
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
import { H1 } from "@/components/ui/heading";

interface Props extends StackProps {}

const SSOAuthForm = (props: any) => {
  // Props
  const { indexRoute, signinAPI, ...restProps } = props;

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
        VALIDATION_FAILED: {
          ...l.error_signin_wrong_credentials,
        },
        INVALID_CREDENTIALS: {
          ...l.error_signin_wrong_credentials,
        },
      },
      403: {
        FORBIDDEN_ROLE: {
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
        url: signinAPI,
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
            router.push(indexRoute);
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
              placeholder="SSO Email"
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
              placeholder="SSO Password"
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
      </form>
    </CContainer>
  );
};
const BasicAuthForm = (props: any) => {
  // Props
  const { indexRoute, signinAPI, ...restProps } = props;

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
        VALIDATION_FAILED: {
          ...l.error_signin_wrong_credentials,
        },
        INVALID_CREDENTIALS: {
          ...l.error_signin_wrong_credentials,
        },
      },
      403: {
        FORBIDDEN_ROLE: {
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
        url: signinAPI,
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
            router.push(indexRoute);
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
              placeholder="Email"
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
const Signedin = (props: any) => {
  // Props
  const { indexRoute, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const removeAuth = useAuthMiddleware((s) => s.removeAuth);
  const user = getUserData();

  // Hooks
  const { req, loading } = useRequest({
    id: "logout",
    loadingMessage: l.loading_signout,
    successMessage: l.success_signout,
  });

  // Utils
  function onSignout() {
    const url = `/api/signout`;

    const config = {
      url,
      method: "GET",
    };

    req({
      config,
      onResolve: {
        onSuccess: () => {
          removeStorage("__auth_token");
          removeStorage("__user_data");
          removeAuth();
        },
      },
    });
  }

  return (
    <VStack gap={4} m={"auto"} {...restProps}>
      <Avatar size={"2xl"} src={user?.photoProfile?.[0]?.fileUrl} />

      <VStack gap={1}>
        <P fontSize={"lg"} fontWeight={"semibold"} textAlign={"center"}>
          Admin
        </P>
        <P color={"fg.muted"} textAlign={"center"}>
          admin@gmail.com
        </P>
      </VStack>

      <VStack>
        <NavLink to={indexRoute}>
          <Btn w={"140px"} colorPalette={themeConfig.colorPalette}>
            {l.access} App
          </Btn>
        </NavLink>

        <Btn
          w={"140px"}
          variant={"ghost"}
          onClick={onSignout}
          loading={loading}
        >
          Signin
        </Btn>
      </VStack>
    </VStack>
  );
};

const SigninForm = (props: Props) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const authToken = useAuthMiddleware((s) => s.authToken);
  const user = getUserData();

  // Hooks
  const searchParams = useSearchParams();
  const activeRoleId = user?.role.id || searchParams.get("roleId");

  // States
  const ROLES = [
    {
      id: 1,
      icon: IconUserCog,
      key: "super_admin",
      sso: true,
      msg: l.msg_signin_as_super_admin,
      IndexRoute: "/cms/static-content",
      form: (
        <SSOAuthForm
          indexRoute={"/cms/static-content"}
          signinAPI={`/api/sso/signin`}
        />
      ),
    },
    {
      id: 3,
      icon: IconDeviceDesktopAnalytics,
      key: "monev",
      indexRoute: "/monev/dashboard",
      sso: true,
      msg: l.msg_signin_as_monev,
      IndexRoute: "/monev/dashboard",
      form: (
        <SSOAuthForm
          indexRoute={"/monev/dashboard"}
          signinAPI={`/api/sso/signin`}
        />
      ),
    },
    {
      id: 2,
      icon: IconChalkboardTeacher,
      key: "educator",
      sso: false,
      msg: l.msg_signin_as_educator,
      IndexRoute: "/kmis/dashboard",
      form: (
        <BasicAuthForm
          indexRoute={"/kmis/dashboard"}
          signinAPI={`/api/admin/signin`}
        />
      ),
    },
  ];
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const selectedRole = ROLES.find((role) => `${role.id}` === activeRoleId);
  const signinForm = selectedRole?.form;
  const msg = selectedRole?.msg;
  const indexRoute = selectedRole?.IndexRoute;

  return (
    <CContainer
      w={"full"}
      maxW={"400px"}
      minH={"400px"}
      m={"auto"}
      gap={8}
      rounded={themeConfig.radii.container}
      {...restProps}
    >
      {authToken ? (
        <Signedin indexRoute={indexRoute} />
      ) : (
        <>
          <CContainer gap={2}>
            <H1 fontSize={"3xl"} fontWeight={"bold"} textAlign={"center"}>
              {l.msg_signin_title}
            </H1>

            <P color={"fg.subtle"} textAlign={"center"}>
              {activeRoleId ? msg : l.msg_signin}
            </P>
          </CContainer>

          {!activeRoleId && (
            <>
              <SimpleGrid flex={1} columns={[1, null, 3]} w={"full"} gap={4}>
                {ROLES.map((role) => {
                  const isActive = selectedRoleId === `${role.id}`;

                  return (
                    <CContainer
                      key={role.key}
                      gap={2}
                      p={4}
                      color={isActive ? themeConfig.primaryColor : ""}
                      border={"1px solid"}
                      borderColor={
                        isActive ? themeConfig.primaryColor : "border.muted"
                      }
                      rounded={themeConfig.radii.container}
                      opacity={isActive ? 1 : 0.6}
                      cursor={"pointer"}
                      pos={"relative"}
                      overflow={"clip"}
                      transition={"200ms"}
                      onClick={() => {
                        setSelectedRoleId(`${role.id}`);
                      }}
                    >
                      {isActive && <DotIndicator />}

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

              <NavLink to={`/?roleId=${selectedRoleId}`}>
                <Btn
                  colorPalette={themeConfig.colorPalette}
                  disabled={!selectedRoleId}
                >
                  {l.next}

                  <Icon>
                    <IconArrowRight stroke={1.5} />
                  </Icon>
                </Btn>
              </NavLink>
            </>
          )}

          {activeRoleId && (
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
        </>
      )}
    </CContainer>
  );
};

export default SigninForm;
