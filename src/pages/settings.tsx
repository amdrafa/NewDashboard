import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
  Text,
  Spinner,
  useToast,
  Checkbox,
  Icon,
} from "@chakra-ui/react";
import Link from "next/link";
import { Input } from "../components/Form/input";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../services/axios";
import Router, { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { Footer } from "../components/footer";
import { parseCookies } from "nookies";
import { decode } from "jsonwebtoken";
import { useQuery } from "react-query";
import { MdPassword } from "react-icons/md";

export type DecodedToken = {
  iat: number;
  exp: number;
  roles: string;
  name: string;
  email: string;
  id: number;
};

interface UserProps {
  id: number;
  name: string;
  email: string;
  document: string;
  companyId?: number;
  isForeigner: boolean;
}

type EditUserFormData = {
  name: string;
  // phone: number;
  email: string;
  document: string;
  // old_password: string;
  // old_password_confirmation: string;
  // new_password?: string;
  // new_password_confirmation?: string;
};

type changePasswordFormData = {
  currentPassword: string;
  currentPasswordConfirmation: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

const updateUserFormSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string(),
  document: yup.string().required(),
  // old_password: yup.string().required(),
  // old_password_confirmation: yup
  //   .string()
  //   .required()
  //   .oneOf(
  //     [null, yup.ref("old_password")],
  //     "The passwords need to be the same"
  //   ),
  // new_password: yup.string().notRequired(),
  // new_password_confirmation: yup
  //   .string()
  //   .notRequired()
  //   .oneOf(
  //     [null, yup.ref("new_password")],
  //     "The passwords need to be the same"
  //   ),
});

const changePasswordFormSchema = yup.object().shape({
  currentPassword: yup.string().required().min(10),
  currentPasswordConfirmation: yup
    .string()
    .required()
    .oneOf(
      [null, yup.ref("currentPassword")],
      "The passwords need to be the same"
    ),
  newPassword: yup.string().required().min(10),
  newPasswordConfirmation: yup
    .string()
    .required()
    .oneOf([null, yup.ref("newPassword")], "The passwords need to be the same"),
});

export default function Settings() {
  const { auth } = parseCookies();

  const decodedUser = decode(auth as string) as DecodedToken;

  const router = useRouter();

  const toast = useToast();

  const [isUserForeigner, setIsUserForeigner] = useState(false);

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery<UserProps>(
    `userlistt`,
    async () => {
      const response = await api.get(`/user/list/${decodedUser.id}`);
      return response.data;
    }
  );

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(updateUserFormSchema),
  });

  const {
    register: PasswordRegister,
    handleSubmit: handleSubmitPassword,
    formState: formStatePassword,
    resetField: resetPasswordField,
  } = useForm({
    resolver: yupResolver(changePasswordFormSchema),
  });

  const { errors: errorsPassword } = formStatePassword;

  const { errors } = formState;

  const handleCreateUser: SubmitHandler<EditUserFormData> = async ({
    name,
    document,
    email,
  }) => {
    const response = await api
      .post("/user/update", {
        id: decodedUser.id,
        name,
        document,
        email,
        isForeigner: isUserForeigner,
      })
      .then((response) => {
        toast({
          title: "Informations updated",
          description: `Informations updated successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        window.location.reload();
      })
      .catch((err) => {
        toast({
          title: "Something went wrong",
          description: `Error when updating informations.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  const handleChangePassword: SubmitHandler<changePasswordFormData> = async ({
    currentPassword,
    newPassword,
  }) => {
    const response = await api
      .post("/user/update", {
        id: decodedUser.id,
        email: data.email,
        password: newPassword,
      })
      .then((response) => {
        toast({
          title: "Password updated",
          description: `Password updated successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        window.location.reload();
      })
      .catch((err) => {
        toast({
          title: "Something went wrong",
          description: `Error when updating password.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  useEffect(() => {
    resetPasswordField("newPassword");
    resetPasswordField("newPasswordConfirmation");
    resetPasswordField("currentPassword");
    resetPasswordField("currentPasswordConfirmation");
  }, [isChangePasswordOpen]);

  return (
    <Box mt={-3}>
      <Header />

      <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6">
        <Sidebar />

        {isChangePasswordOpen ? (
          <Box
            as="form"
            flex="1"
            height={"100%"}
            borderRadius={8}
            bg="gray.800"
            p="8"
            mt={5}
            onSubmit={handleSubmitPassword(handleChangePassword)}
          >
            <Flex justify={"space-between"} align="center">
              <Heading size="lg" fontWeight="normal">
                Configurations
              </Heading>

              <Button
                color={isChangePasswordOpen ? "white" : "gray.400"}
                onClick={() => {
                  window.location.reload();
                }}
                bg={isChangePasswordOpen ? "red.500" : "gray.900"}
                _hover={{ bg: "blue.500", color: "white" }}
              >
                <Icon mr={1.5} as={MdPassword} />
                {isChangePasswordOpen ? "Cancel" : "Change password"}
              </Button>
            </Flex>

            <Divider my="6" borderColor="gray.700" />

            {!isLoading ? (
              <>
                <VStack spacing="8">
                  <Box w={'100%'}>
                    <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                      <Input
                        type={"password"}
                        defaultValue={""}
                        name="currentPassword"
                        label="Current password"
                        {...PasswordRegister("currentPassword")}
                        error={errorsPassword.currentPassword}
                      />

                      <Input
                        defaultValue={""}
                        type={"password"}
                        name="currentPasswordConfirmation"
                        label="Current password confirmation"
                        {...PasswordRegister("currentPasswordConfirmation")}
                        error={errorsPassword.currentPasswordConfirmation}
                      />
                    </SimpleGrid>

                    <Text ml={'0.3rem'} fontSize={'0.8rem'} mt={'0.5rem'} color={"gray.400"}>Min 10 characters</Text>
                  </Box>

                  <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                    <Input
                      type={"password"}
                      name="newPassword"
                      label="New password"
                      {...PasswordRegister("newPassword")}
                      error={errorsPassword.newPassword}
                    />

                    <Input
                      type={"password"}
                      name="newPasswordConfirmation"
                      label="New password confirmation"
                      {...PasswordRegister("newPasswordConfirmation")}
                      error={errorsPassword.newPasswordConfirmation}
                    />
                  </SimpleGrid>
                </VStack>

                <Flex mt="8" justify="flex-end">
                  <HStack spacing="4">
                    <Button
                      isLoading={formStatePassword.isSubmitting}
                      type="submit"
                      colorScheme="blue"
                    >
                      Save
                    </Button>
                  </HStack>
                </Flex>
              </>
            ) : (
              <Flex justify="center">
                <Spinner mt="110px" mb="110px" />
              </Flex>
            )}
          </Box>
        ) : (
          <Box
            as="form"
            flex="1"
            height={"100%"}
            borderRadius={8}
            bg="gray.800"
            p="8"
            mt={5}
            onSubmit={handleSubmit(handleCreateUser)}
          >
            <Flex justify={"space-between"} align="center">
              <Heading size="lg" fontWeight="normal">
                Configurations
              </Heading>

              <Button
                color={isChangePasswordOpen ? "white" : "gray.400"}
                onClick={() => {
                  setIsChangePasswordOpen(!isChangePasswordOpen);

                  resetPasswordField("newPassword");
                  resetPasswordField("newPasswordConfirmation");
                  resetPasswordField("currentPassword");
                  resetPasswordField("currentPasswordConfirmation");
                }}
                bg={isChangePasswordOpen ? "red.500" : "gray.900"}
                _hover={{ bg: "blue.500", color: "white" }}
              >
                <Icon mr={1.5} as={MdPassword} />
                {isChangePasswordOpen ? "Cancel" : "Change password"}
              </Button>
            </Flex>

            <Divider my="6" borderColor="gray.700" />

            {!isLoading ? (
              <>
                <VStack spacing="8">
                  <HStack w={"100%"}>
                    <Checkbox
                      defaultChecked={data.isForeigner}
                      onChange={(e) => setIsUserForeigner(e.target.checked)}
                    />
                    <Text>I'm foreigner</Text>
                  </HStack>
                  <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                    <Input
                      defaultValue={data?.name}
                      name="name"
                      label="Full name"
                      {...register("name")}
                      error={errors.name}
                    />

                    <Input
                      defaultValue={data?.document}
                      name="document"
                      label="Document"
                      {...register("document")}
                      error={errors.document}
                    />
                  </SimpleGrid>

                  <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={4}>
                    <Input
                      defaultValue={data?.email}
                      name="email"
                      label="E-mail"
                      {...register("email")}
                      error={errors.email}
                      type="email"
                      isDisabled
                    />
                  </SimpleGrid>
                </VStack>

                <Flex mt="8" justify="flex-end">
                  <HStack spacing="4">
                    <Link href="home">
                      <Button colorScheme="whiteAlpha">Cancel</Button>
                    </Link>
                    <Button
                      isLoading={formState.isSubmitting}
                      type="submit"
                      colorScheme="blue"
                    >
                      Save
                    </Button>
                  </HStack>
                </Flex>
              </>
            ) : (
              <Flex justify="center">
                <Spinner mt="110px" mb="110px" />
              </Flex>
            )}
          </Box>
        )}
      </Flex>

      <Flex>
        <Flex w={{ lg: "275px" }}></Flex>
        <Footer />
      </Flex>
    </Box>
  );
}
