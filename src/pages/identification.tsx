import { Flex, Button, Stack, Icon, Divider, Text } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { Input } from "../components/Form/input";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../services/axios";
import { signIn as githubSignIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Router from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type SignInFormData = {
  code: string;
};

const SignInFormSchema = yup.object().shape({
  code: yup.string().required(),
});

export default function Identification() {
  const { data: session } = useSession();

  const [status, setStatus] = useState(0);

  console.log(session);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(SignInFormSchema),
  });

  const { errors } = formState;

  const handleSignin: SubmitHandler<SignInFormData> = async ({ code }) => {
    console.log(status + "1");

    try {
      const response = await api
      .post("connecttonewcompany", { data: code, session })
      .then((response) => setStatus(response.status));
    } catch (err) {
      
      setStatus(err.response.status);
      toast.error('Secret code not found')
    }

   
  };

  useEffect(() => {
    console.log(status + "2");
    if (status === 200) {
      console.log("User connected to company");
      Router.push("/dashboard");
    } else {
      console.log(`User couldn't be connected to company`);
      
      const errorMessage = "Secret code not recognized. Please contact your ";
    }
  }, [status]);

  return (
    
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center">
      <ToastContainer theme="colored"/>
      <Flex
        as="form"
        w="100%"
        maxW={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSubmit(handleSignin)}
        mr="10"
      >
        <Text fontSize="25">{`Welcome, ${session?.user.name}!`}</Text>
        <Stack spacing={4}>
          <Text
            pt="2"
            fontSize="15"
            color="gray.300"
            mt="2"
          >{`• The secret code of your company was sent to your manager`}</Text>
          <Text
            fontSize="15"
            color="gray.300"
            mb="2"
          >{`• You need a secret key to be part of a company`}</Text>

          <Input
            name="code"
            label="Secret code"
            error={errors.code}
            {...register("code")}
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

        <Button
          mt="4"
          colorScheme="red"
          size="lg"
          onClick={() =>
            signOut({
              callbackUrl: `${window.location.origin}/`,
            })
          }
        >
          Exit
        </Button>
      </Flex>
    </Flex>
  );
}
