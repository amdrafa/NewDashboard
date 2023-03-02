import { Flex, Button, Stack, Icon, Divider, Text, Box } from "@chakra-ui/react";
import { Input } from "../components/Form/input";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../services/axios";
import { useContext, useState } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { signIn as githubSignIn, useSession } from "next-auth/react";
import Router from "next/router";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { Logo } from "../components/Header/Logo";

type SignInFormData = {
  email: string;
  password: string;
};

const SignInFormSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

export default function Login() {

  const { loginAuth } = useContext(LoginContext);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(SignInFormSchema),
  });

  const { errors} = formState;

  const handleSignin: SubmitHandler<SignInFormData> = async ({ email, password }) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    loginAuth({ email, password });
  };

  return (
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center">
      <Box>
        <Flex
        as="form"
        w="100%"
        maxW={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignin)}
      >
        <Stack spacing={4}>
        <Input
            type="email"
            name="email"
            label="E-mail"
            error={errors.email}
            {...register("email")}
          />

          <Input
            type="password"
            name="password"
            label="Password"
            error={errors.password}
            {...register("password")}
          />
        </Stack>

        <Button
          type="submit"
          mt="8"
          colorScheme="twitter"
          size="lg"
          isLoading={formState.isSubmitting}
        >
          Enter
        </Button>

        <Flex justifyContent={'space-between'} w='100%'>
            
       </Flex>

        <Flex alignItems="center" justifyContent="center" mt="8">
          
        <Flex cursor={'pointer'} flex='1' justify={'center'} _hover={{color: 'gray.200'}}>
          <Logo
          width=""
          />
        </Flex>
          
          <Box>
          <Link href="/register" passHref>
            <Text color="gray.200" cursor="pointer" fontSize={14}  _hover={{color: "blue.400"}}>Register now!</Text>
          </Link>
        
        
        <Link href="/recovery" passHref>
          <Text color="gray.200" cursor="pointer" fontSize={14}  _hover={{color: "blue.400"}}>Forgot password?</Text>
          </Link>
          </Box>
        
        </Flex>

        
      </Flex>

      
      </Box>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const {auth} = parseCookies(ctx)

  if(auth){
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}
