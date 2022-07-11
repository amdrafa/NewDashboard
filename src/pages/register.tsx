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

type SignInFormData = {
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

const SignInFormSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().required().email(),
  cpf: yup.string().required().min(10, "Minimum 10 characteres").max(14, "Maximum 14 characteres"),
  phone: yup.string().required().min(10, "Minimum 10 letters.").max(14, "Maximum 14 characteres"),
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

export default function Register() {

  const [page, setPage] = useState(1);

  const [hasDriverLicence, setHasDriverLicence] = useState(false);


  const { createUser } = useContext(LoginContext);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(SignInFormSchema),
    
  });

  const { errors, isSubmitting } = formState;

  const handleSignin: SubmitHandler<SignInFormData> = async ({
    email,
    password,
    name,
    cpf,
    phone,
    register_number,
    driver_category,
    expires_at,
  }) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    

    if(page == 1 && hasDriverLicence){
      console.log('a')
      setPage(2)
      
      return;
    }

    if (hasDriverLicence) {
      createUser({
        name,
        email,
        password,
        phone,
        cpf,
        register_number,
        driver_category,
        expires_at,
      });
      console.log("user created with driver licence");
    } else {
      createUser({
        name,
        email,
        password,
        phone,
        cpf,
        register_number: null,
        driver_category: null,
        expires_at: null,
      });
      console.log("user created without driver licence");
    }
  };

 



  return (
    <Flex
      w="100vw"
      h="100vh"
      alignItems="center"
      justifyContent="center"
      px={6}
    >
      <Flex
        as="form"
        autoComplete="off"
        w="100%"
        maxW={900}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignin)}
      >
        <VStack spacing={4}>
          {page == 1 ? (
            <>
              <Flex
                w={"100%"}
                mb={3}
                justify="space-between"
                alignItems={"center"}
              >
                <Text ml={-1} fontSize={"24"} fontWeight="200">
                  Registration
                </Text>

                <Flex alignItems="center" justifyContent="center">
                  {hasDriverLicence == true ? (
                    <>
                      <Box mr={1}>
                        <Icon
                          fontSize={12}
                          mr={2}
                          color={page == 1 ? "blue.500" : "gray.600"}
                          as={FaCircle}
                        />
                        <Icon
                          fontSize={12}
                          as={FaCircle}
                          color={page != 1 ? "blue.500" : "gray.600"}
                        />
                      </Box>
                    </>
                  ) : (
                    <Icon
                      fontSize={12}
                      mr={2}
                      color={page == 1 ? "blue.500" : "gray.600"}
                      as={FaCircle}
                    />
                  )}
                </Flex>
              </Flex>
              <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                <Input
                  name="name"
                  label="Full name"
                  {...register("name")}
                  error={errors.name}
                />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                <Input
                  name="cpf"
                  label="CPF"
                  type="number"
                  {...register("cpf")}
                  error={errors.cpf}
                  maxLength={10}
                />
                <Input
                  name="phone"
                  label="Phone"
                  type={'number'}
                  {...register("phone")}
                  error={errors.phone}
                  placeholder='47 900000000'
                />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                <Input
                  name="email"
                  label="E-mail"
                  type={"email"}
                  {...register("email")}
                  error={errors.email}
                />
                <Input
                  name="email_confirmation"
                  type="email"
                  label="E-mail confirmation"
                  {...register("email_confirmation")}
                  error={errors.email_confirmation}
                />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={4}>
                <Input
                  name="password"
                  type="password"
                  label="Password"
                  {...register("password")}
                  error={errors.password}
                />
                <Input
                  name="password_confirmation"
                  type="password"
                  label="Password confirmation"
                  {...register("password_confirmation")}
                  error={errors.password_confirmation}
                />
              </SimpleGrid>
              <Flex w={"100%"} alignItems={"center"} mt="9">
                <Text ml={1} mr={2}>
                  Do you have driver licence?
                </Text>
                <Checkbox
                  onChange={(e) => setHasDriverLicence(e.target.checked)}
                />
              </Flex>
              <Flex
                pt={10}
                w={"100%"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Link href="/" passHref>
                  <Button
                    as="a"
                    size="sm"
                    fontSize="sm"
                    colorScheme="black"
                    cursor={"pointer"}
                    leftIcon={<Icon as={MdLogin} fontSize="20" />}
                  >
                    Already have an{" "}
                    <Text ml={"5px"} color={"blue.500"}>
                      account?
                    </Text>
                  </Button>
                </Link>

                {hasDriverLicence ? (
                  <Button colorScheme={"twitter"} type={"submit"} isLoading={isSubmitting}>
                    Next
                  </Button>
                ) : (
                  <Button colorScheme={"twitter"} type={"submit"} isLoading={isSubmitting}>
                    Submit
                  </Button>
                )}
              </Flex>
            </>
          ) : (
            <>
              <Flex
                w={"100%"}
                mb={3}
                justify="space-between"
                alignItems={"center"}
              >
                <Box>
                  <Text ml={-1} fontSize={"24"} fontWeight="200">
                    Driver licence
                  </Text>
                </Box>

                <Flex alignItems="center" justifyContent="center">
                  <Box mr={1}>
                    <Icon
                      fontSize={12}
                      mr={2}
                      color={page == 1 ? "blue.500" : "gray.600"}
                      as={FaCircle}
                    />
                    <Icon
                      fontSize={12}
                      as={FaCircle}
                      color={page != 1 ? "blue.500" : "gray.600"}
                    />
                  </Box>
                </Flex>
              </Flex>

              <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={4}>
                
                <Input
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

              <Flex
                pt={10}
                w={"100%"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Link href="/" >
                <Button
                  bg={"gray.300"}
                  cursor={"pointer"}
                  isLoading={isSubmitting}
                >
                  Return
                </Button>
                </Link>

                <Button colorScheme={"twitter"} type={"submit"} isLoading={isSubmitting}>
                  Submit
                </Button>
              </Flex>
            </>
          )}
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
      </Flex>
    </Flex>
  );
}
