import { Flex, Button, Stack, Text, Box, useToast } from "@chakra-ui/react";
import { Input } from "../components/Form/input";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../services/axios";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

type RecoveryFormData = {
    forgot_email: string;
};

const RecoveryFormSchema = yup.object().shape({
  forgot_email: yup.string().required().email(),
});

export default function Recovery() {

    const toast = useToast()

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(RecoveryFormSchema),
  });

  const { errors, isSubmitting} = formState;

  const handleRecovery: SubmitHandler<RecoveryFormData> = async ({ forgot_email }) => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    api.post('passwordrecovery', {
        forgot_email
    })
    .then(response => {
        toast({
            title: "E-mail sent",
            description: `Your password was sent to ${forgot_email}.`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: 'top-right'
          });
    })
    .catch(err => {
        toast({
            title: "E-mail not found",
            description: `${forgot_email} was not found in our database.`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: 'top-right'
          });
    })

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
        onSubmit={handleSubmit(handleRecovery)}
      >
        <Stack spacing={4}>

        <Box>
        <Text fontSize={20} fontWeight='bold'>Forgot password?</Text>
        <Text>Your password will be sent to your e-mail.</Text>
        </Box>


    
          <Input
            type="email"
            name="forgot_email"
            label="E-mail"
            error={errors.forgot_email}
            {...register("forgot_email")}
          />
        
          

        </Stack>

        <Button
        type="submit"
          mt="8"
          colorScheme="twitter"
          size="lg"
          isLoading={isSubmitting}
        >
          Continue
        </Button>

        <Link href="/recovery" passHref>
        <Button
          mt="2"
          colorScheme="green"
          size="lg"
          onClick={() => {
            window.location.reload();

          }}
        >
          Login
        </Button>
        </Link>

       
      </Flex>
      
      
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
