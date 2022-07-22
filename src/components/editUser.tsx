import {
  Flex,
  Button,
  Stack,
  Icon,
  Divider,
  Text,
  VStack,
  SimpleGrid,
  Box,
  Checkbox,
  Heading,
  HStack,
} from "@chakra-ui/react";
import { Input } from "../components/Form/input";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../services/axios";
import { useContext, useState } from "react";
import { LoginContext } from "../contexts/LoginContext";
import Router from "next/router";
import Link from "next/link";
import { RiAddLine } from "react-icons/ri";
import { MdLogin } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";

type EditUserFormSchema = {
  name: string;
  email: string;
  cpf: number;
  phone: number;
  email_confirmation: string;
  password: string;
  password_confirmation: string;
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
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignInFormSchema = yup.object().shape({
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
  email_confirmation: yup
    .string()
    .oneOf([null, yup.ref("email")], "The e-mails need to be the same"),
  password: yup.string().required().min(6, "Minimum 6 letters."),
  password_confirmation: yup
    .string()
    .required()
    .oneOf([null, yup.ref("password")], "The passwords need to be the same"),
  register_number: yup.string().max(11),
  driver_category: yup.string(),
  expires_at: yup.date(),
});

export function EditUser({
  email,
  name,
  cpf,
  phone,
  register_number,
  driver_category,
  expires_at,
  setIsEditMode
}: EditUserFormData) {
  const [page, setPage] = useState(1);

  const [hasDriverLicence, setHasDriverLicence] = useState(false);

  const { createUser } = useContext(LoginContext);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(SignInFormSchema),
  });

  const { errors, isSubmitting } = formState;

  const handleSignin: SubmitHandler<EditUserFormSchema> = async ({
    email,
    password,
    name,
    cpf,
    phone,
    register_number,
    driver_category,
    expires_at,
    
  }) => {
    //   await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(
      email,
      name,
      cpf,
      phone,
      register_number,
      driver_category,
      expires_at
    );
    return;
  };

  return (
    <Box as="form" flex="1" borderRadius={8} bg="gray.800" p="8" mt={5}>
      <VStack spacing={4}>
        
          
            <Flex
              w={"100%"}
              mb={3}
              justify="space-between"
              alignItems={"center"}
            >
              <Heading size="lg" fontWeight="normal">
                Edit user
              </Heading>
              <Button bg="red.500" _hover={{ bg: "red.400" }}>
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
                label="CPF"
                type="number"
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
                defaultValue={'15-12-22'}
                name="expires_at"
                type="date"
                label="Expires at"
                {...register("expires_at")}
                error={errors.expires_at}
                colorScheme="whatsapp"
                css={`
                  ::-webkit-calendar-picker-indicator {
                    opacity: 0.15;
                  }
                `}
              />
            </SimpleGrid>

            <Flex w={'100%'} mt="8" justify="flex-end">
              <HStack spacing="4">
                <Button onClick={() => {
                    setIsEditMode(false)
                }} colorScheme="whiteAlpha">
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
