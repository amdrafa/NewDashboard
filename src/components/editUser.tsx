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
  cpf: number;
  phone: number;
  register_number?: number;
  driver_category?: string;
  expires_at?: Date;
};

type EditUserFormData = {
  name: string;
  email: string;
  cpf: number;
  phone: number;
  register_number?: string;
  driver_category?: string;
  expires_at?: string;
  userId: string;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditUserFormSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().required().email(),
  cpf: yup
    .string()
    .required()
    .min(10, "Minimum 10 characteres")
    .max(14, "Maximum 14 characteres"),
  phone: yup
    .string()
    .required()
    .min(10, "Minimum 10 letters.")
    .max(14, "Maximum 14 characteres"),
  register_number: yup.string().max(11),
  driver_category: yup.string(),
  expires_at: yup.string(),
});

export function EditUser({
  email,
  name,
  cpf,
  phone,
  register_number,
  driver_category,
  expires_at,
  setIsEditMode,
  userId,
}: EditUserFormData) {
  const toast = useToast();

  const [hasDriverLicence, setHasDriverLicence] = useState(false);

  const { createUser } = useContext(LoginContext);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(EditUserFormSchema),
  });

  const { errors, isSubmitting } = formState;

  function deleteUser(id: string) {
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

  const handleEditUser: SubmitHandler<EditUserFormSchema> = async ({
    email,
    name,
    cpf,
    phone,
    register_number,
    driver_category,
    expires_at,
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    register_number.toString() == ""
      ? api
        .put("edituser", {
          email,
          name,
          cpf,
          phone,
          register_number,
          driver_category,
          expires_at,
          userId,
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
          toast({
            title: "Something went wrong",
            description: `Something went wrong when deleting ${name}.`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        })
      : api
        .put("edituser", {
          email,
          name,
          cpf,
          phone,
          register_number,
          driver_category,
          expires_at,
          userId,
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
              deleteUser(userId);
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

        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
          <Input
            defaultValue={name}
            name="name"
            label="Full name"
            {...register("name")}
            error={errors.name}
          />
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
          <Input
            defaultValue={email}
            name="email"
            label="E-mail"
            type={"email"}
            {...register("email")}
            error={errors.email}
          />
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={2}>
          <Input
            defaultValue={cpf}
            name="cpf"
            label="CPF/Passport"
            {...register("cpf")}
            error={errors.cpf}
            maxLength={10}
          />
          <Input
            defaultValue={phone}
            name="phone"
            label="Phone"
            type={"number"}
            {...register("phone")}
            error={errors.phone}
            placeholder="47 900000000"
          />
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={4}>
          <Input
            defaultValue={register_number}
            name="register_number"
            label="Register number"
            type={"number"}
            {...register("register_number")}
            error={errors.register_number}
          />
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={4}>
          <Box>
            <Input
              defaultValue={driver_category}
              name="driver_category"
              label="License"
              {...register("driver_category")}
              error={errors.driver_category}
              maxLength={5}
            />
            <Text mt={2} ml={1} color={"gray.300"}>
              Ex: AB
            </Text>
          </Box>
          <Input
            defaultValue={
              !expires_at
                ? ""
                : `${dayjs(expires_at).format("YYYY")}-${dayjs(
                  expires_at
                ).format("MM")}-${dayjs(expires_at).format("DD")}`
            }
            name="expires_at"
            type="date"
            label="Expires at"
            {...register("expires_at")}
            error={errors.expires_at}
            css={`
              ::-webkit-calendar-picker-indicator {
                opacity: 0.15;
              }
            `}
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
