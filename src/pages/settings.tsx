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

export default function Settings() {

  const { auth } = parseCookies();

  const decodedUser = decode(auth as string) as DecodedToken;

  const router = useRouter()

  const toast = useToast();

  const [status, setStatus] = useState(0);

  const [changePassword, setChangePassword] = useState(false);

  const { data, isLoading, error, refetch } = useQuery<UserProps>(
    `userlistt`,
    async () => {
      const response = await api.get(`/user/list/${decodedUser.id}`);
      return response.data;
    }
  );

  const { user } = useContext(LoginContext);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(updateUserFormSchema),
  });

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
      email
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

      window.location.reload()
    })
    .catch(err => {
      toast({
        title: "Something went wrong",
        description: `Error when updating informations.`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    })
  };

  return (
    <Box mt={-3}>
      <Header />

      <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6">
        <Sidebar />

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
          <Heading size="lg" fontWeight="normal">
            Configurations
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          {user ? (
            <>
              <VStack spacing="8">
                <HStack w={"100%"}>
                  <Checkbox />
                  <Text>I'm foreigne FALTANDO ENVIAR VALORES DE FOREIGNER E TROCA DE PASSWORDr</Text>
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
      </Flex>

      <Flex>
        <Flex w={{ lg: "275px" }}></Flex>
        <Footer />
      </Flex>
    </Box>
  );
}
