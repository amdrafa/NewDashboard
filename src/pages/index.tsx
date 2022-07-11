import { Flex, Button, Stack, Icon, Divider, Text } from "@chakra-ui/react";
import { Input } from "../components/Form/input";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../services/axios";
import { useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { signIn as githubSignIn, useSession } from "next-auth/react";
import Router from "next/router";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

type SignInFormData = {
  email: string;
  password: string;
};

const SignInFormSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

export default function Home() {


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

        <Flex display="grid" alignItems="center" justifyContent="center" mt="8">
          <Text>Aren't you registered?</Text>
        </Flex>
        <Flex display="grid" alignItems="center" justifyContent="center">
          <Link href="/register" passHref>
            <Text color="blue.600" cursor="pointer"  _hover={{color: "blue.400"}}>Register now!</Text>
          </Link>
        </Flex>
      </Flex>

      
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const {auth} = parseCookies(ctx)

  if(auth){
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}
