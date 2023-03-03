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

type SignInFormData = {
  name: string;
  email: string;
  document: string;
  phone: number;
  email_confirmation: string;
  password: string;
  password_confirmation: string;
};

const SignInFormSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().required().email(),
  document: yup.string().required().min(10, "Minimum 10 characteres").max(14, "Maximum 14 characteres"),
  phone: yup.string().required().min(10, "Minimum 10 letters.").max(14, "Maximum 14 characteres"),
  email_confirmation: yup
    .string()
    .oneOf([null, yup.ref("email")], "The e-mails need to be the same"),
  password: yup.string().required().min(6, "Minimum 6 letters."),
  password_confirmation: yup
    .string()
    .required()
    .oneOf([null, yup.ref("password")], "The passwords need to be the same"),
});

export default function Register() {

  const [isForeigner, setIsForeigner] = useState(false)

  const { createUser } = useContext(LoginContext);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(SignInFormSchema),

  });

  const { errors, isSubmitting } = formState;

  const handleSignin: SubmitHandler<SignInFormData> = async ({
    email,
    password,
    name,
    document,
    phone,
  }) => {
      createUser({
        name,
        email,
        password,
        phone,
        document,
        isForeigner
      });
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
          
              <Flex
                w={"100%"}
                mb={3}
                justify="space-between"
                alignItems={"center"}
              >
                <Text ml={-1} fontSize={"24"} fontWeight="200">
                  Registration
                </Text>

                
              </Flex>
              <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                <Input
                  name="name"
                  label="Full name"
                  {...register("name")}
                  error={errors.name}
                />
              </SimpleGrid>

              <HStack w={'100%'} mb='0.5rem'>
                <Checkbox isChecked={isForeigner} onChange={(e) => setIsForeigner(e.target.checked)}/>
                <Text>
                  I'm foreigner
                </Text>
              </HStack>

              <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                <Input
                  name="document"
                  label={isForeigner ? "Passport" : "CPF" }
                  {...register("document")}
                  error={errors.document}
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
                  <Button colorScheme={"twitter"} type={"submit"} isLoading={isSubmitting}>
                    Submit
                  </Button>
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
      </Flex>
    </Flex>
  );
}
