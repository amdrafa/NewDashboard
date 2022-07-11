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
} from "@chakra-ui/react";
import Link from "next/link";
import { Input } from "../components/Form/input";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../services/axios";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { toast } from "react-toastify";

type CreateSpeedwayFormData = {
  name: string;
  phone: number;
  email: string;
  cpf: number;
  old_password: string;
  old_password_confirmation: string;
  new_password: string;
  new_password_confirmation: string;
};

const createUserFormSchema = yup.object().shape({
  name: yup.string().required(),
  phone: yup.number().required(),
  email: yup.string().required(),
  cpf: yup.number().required(),
  old_password: yup.string().required(),
  old_password_confirmation: yup
    .string()
    .required()
    .oneOf(
      [null, yup.ref("old_password")],
      "The passwords need to be the same"
    ),
  new_password: yup.string().required().min(6, "Minimum 6 letters."),
  new_password_confirmation: yup
    .string()
    .required()
    .min(6, "Minimum 6 letters.")
    .oneOf(
      [null, yup.ref("new_password")],
      "The new passwords need to be the same"
    ),
});

export default function Settings() {
  const [status, setStatus] = useState(0);

  useEffect(() => {
    status == 200 && toast.success('Informations updated');
  }, [status]);

  const { user } = useContext(LoginContext);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createUserFormSchema),
  });

  const { errors } = formState;

  const handleCreateUser: SubmitHandler<CreateSpeedwayFormData> = async ({
    old_password,
    new_password,
    name,
    phone,
    email,
    cpf
  }) => {
    console.log(old_password, new_password);
    // Router.push('/speedways')
    try {
      const response = await api
        .post("updatedata", {
          data: new_password,
          old_password,
          name,
          phone, 
          new_email: email,
          current_email: user.email,
          cpf
        })
        .then((response) => setStatus(response.status));
    } catch (err) {
      toast.error("Current password not correct");
    }
  };
  
  return (
    <Box mt={-3} >
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
                <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                  <Input
                    defaultValue={user?.name}
                    name="name"
                    label="Full name"
                    {...register("name")}
                    error={errors.name}
                  />

                  <Input
                    defaultValue={user?.phone}
                    type="number"
                    name="phone"
                    label="Phone"
                    {...register("phone")}
                    error={errors.phone}
                  />
                </SimpleGrid>

                <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={4}>
                  <Input
                    defaultValue={user?.email}
                    name="email"
                    label="E-mail"
                    {...register("email")}
                    error={errors.email}
                    type="email"
                  />
                  <Input
                    defaultValue={user?.userId}
                    type="number"
                    name="cpf"
                    label="CPF"
                    {...register("cpf")}
                    error={errors.cpf}
                  />
                </SimpleGrid>

                <Divider my="4" borderColor="gray.700" />

                <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                  <Input
                    name="old_password"
                    label="Current password"
                    {...register("old_password")}
                    error={errors.old_password}
                    type="password"
                  />
                  <Input
                    type="password"
                    name="old_password_confirmation"
                    label="Current password confirmation"
                    {...register("old_password_confirmation")}
                    error={errors.old_password_confirmation}
                  />
                </SimpleGrid>

                <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                  <Box>
                    <Input
                      type={"password"}
                      name="new_password"
                      label="New password"
                      {...register("new_password")}
                      error={errors.new_password}
                    />
                    <Text ml={2} mt={2} color="gray.500">
                      Minimum 6 characteres
                    </Text>
                  </Box>

                  <Input
                    type={"password"}
                    name="new_password_confirmation"
                    label="New password confirmation"
                    {...register("new_password_confirmation")}
                    error={errors.new_password_confirmation}
                  />
                </SimpleGrid>
              </VStack>

              <Flex mt="8" justify="flex-end">
                <HStack spacing="4">
                  <Link href="userdashboard">
                    <Button  colorScheme="whiteAlpha">
                      Cancel
                    </Button>
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
    </Box>
  );
}
