import {
  Flex,
  Button,
  Icon,
  Divider,
  Text,
  VStack,
  SimpleGrid,
  Box,
  Heading,
  HStack,
  useToast,
  Checkbox,
} from "@chakra-ui/react";
import { Input } from "../components/Form/input";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../services/axios";
import { useContext, useState } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { FiTrash2 } from "react-icons/fi";
import dayjs from "dayjs";

type EditUserFormSchema = {
  name: string;
  email: string;
  document: string;
};

interface companyProps {
  id: number;
  name: string;
  cnpj: string;
  status: string;
  createdAt?: string;
}

type EditUserFormData = {
  id: number;
  name: string;
  email: string;
  document: string;
  companyId?: number;
  isForeigner: boolean;
  selectedUserCompany: companyProps[];
  setIsForeigner: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditUserFormSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().required().email(),
  document: yup
    .string()
    .required()
    .min(10, "Minimum 10 characteres")
    .max(14, "Maximum 14 characteres"),
});

export function EditUser({
  email,
  name,
  document,
  setIsEditMode,
  isForeigner,
  id,
  companyId,
  setIsForeigner,
  selectedUserCompany
}: EditUserFormData) {
  const toast = useToast();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(EditUserFormSchema),
  });

  const { errors, isSubmitting } = formState;

  function deleteUser() {
    api
      .delete("deleteuser", { data: { id } })
      .then((response) => {
        toast({
          title: "User deleted",
          description: `${name} was deleted successfully.`,
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
          description: `Something went wrong when deleting ${name}.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      });
  }

  // trocar para handle updateUserCompany e pegar dado somente da empresa que será vinculada ao mesmo

  const handleEditUser: SubmitHandler<EditUserFormSchema> = async ({
    email,
    name,
    document,
  }) => {
    await api
      .post("/user/update", {
        id,
        email,
        name,
        document,
        isForeigner
      })
      .then((response) => {
        toast({
          title: "User updated",
          description: `${name} was updated successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        window.location.reload();
      })
      .catch((err) => {
        console.log(err)
        toast({
          title: "Something went wrong",
          description: `Something went wrong when deleting ${name}.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      });

    return;
  };

  return (
    <Box
      as="form"
      flex="1"
      borderRadius={8}
      bg="gray.800"
      p="8"
      mt={5}
      onSubmit={handleSubmit(handleEditUser)}
    >
      <VStack spacing={4}>
        <Flex w={"100%"} mb={3} justify="space-between" alignItems={"center"}>
          <Heading size="lg" fontWeight="normal">
            Edit user
          </Heading>
          <Button
            onClick={() => {
              deleteUser();
              return;
            }}
            bg="red.500"
            _hover={{ bg: "red.400" }}
          >
            <Icon mr={1.5} as={FiTrash2} />
            Delete user
          </Button>
        </Flex>

        <Divider my="6" borderColor="gray.700" />

        <Flex justify={"start"} w="100%" mb={"1rem"}>
          <HStack>
            <Checkbox
              defaultChecked={isForeigner}
              isDisabled
            />
            <Text color={'gray.500'}>Is foreigner</Text>
          </HStack>
        </Flex>

        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
          <Input
            defaultValue={name}
            name="name"
            label="Full name"
            {...register("name")}
            error={errors.name}
            isDisabled
          />

          <Input
            defaultValue={document}
            name="document"
            label="Document"
            {...register("document")}
            error={errors.document}
            maxLength={10}
            isDisabled
          />
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={'4rem'}>
          <Input
            defaultValue={email}
            name="email"
            label="E-mail"
            type={"email"}
            {...register("email")}
            error={errors.email}
            isDisabled
          />
        </SimpleGrid>

        <Divider my="6" borderColor="gray.700" />

        <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={'4rem'}>
          <Input
            defaultValue={selectedUserCompany[0]?.name}
            name="company"
            label="Associate a company"
            placeholder="Search for a company"
          />
        </SimpleGrid>

        <Flex w={"100%"} mt="8" justify="flex-end">
          <HStack spacing="4">
            <Button
              onClick={() => {
                setIsEditMode(false);
              }}
              colorScheme="whiteAlpha"
            >
              Cancel
            </Button>
            <Button
              isLoading={formState.isSubmitting}
              type={"submit"}
              colorScheme="blue"
            >
              Save
            </Button>
          </HStack>
        </Flex>
      </VStack>

      {/* <Button
            type="submit"
            mt="8"
            colorScheme="twitter"
            size="lg"
            isLoading={isSubmitting}
          >
            Register
          </Button> */}
    </Box>
  );
}
