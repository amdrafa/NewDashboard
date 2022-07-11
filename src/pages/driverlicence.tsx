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

type UpdateDriverLicenceData = {
  register_number: string;
  driver_category: string;
  expires_at: string;
};

const createUserFormSchema = yup.object().shape({
  register_number: yup.string().required(),
  driver_category: yup.string().required(),
  expires_at: yup.date().required(),
});

export default function DriverLicence() {
  const { user: userContext } = useContext(LoginContext);

  const [status, setStatus] = useState(0);

  const [defaultRegister_number, setDefaultRegister_number] = useState('');
  const [defaultDriver_category, setDefaultDriver_category] = useState('');
  const [defaultExpires_at, setDefaultExpires_at] = useState('');

  useEffect(() => {
    
    const response = api.get<UpdateDriverLicenceData>('mydriverlicence')
    .then(response => {

      const day = new Date(response.data.expires_at).getDate().toString().slice(0,2).length > 1 ? (new Date(response.data.expires_at).getDate().toString().slice(0,2)) : ('0' + new Date(response.data.expires_at).getDate().toString().slice(0,2))

      setDefaultRegister_number(response.data.register_number)
      setDefaultDriver_category(response.data.driver_category)
      setDefaultExpires_at((new Date(response.data.expires_at).getFullYear().toString()) + "-" + ("0" + (new Date(response.data.expires_at).getMonth() + 1)).slice(-2) + "-" + day)
      
      console.log(("0" + (new Date().getMonth() + 1)).slice(-2))
      
     console.log((new Date(response.data.expires_at).getFullYear().toString()) + "-" + ("0" + (new Date(response.data.expires_at).getMonth() + 1)).slice(-2) + "-" + (new Date(response.data.expires_at).getDate().toString().slice(0,2)))
      
      console.log('0' + new Date(response.data.expires_at).getDate().toString().slice(0,2))
      
    })
    .catch(error => console.log(error))

      
  }, [])


  useEffect(() => {
    status == 200 && toast.success('Driver licence updated')
  }, [status]);

  const { user } = useContext(LoginContext);

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createUserFormSchema),
  });

  const { errors } = formState;

  const handleUpdateDriverLicence: SubmitHandler<UpdateDriverLicenceData> = async ({
    register_number,
    driver_category,
    expires_at,
  }) => {
    console.log();
    // Router.push('/speedways')
    try {
      const response = await api
        .post("updatedriverlicence", {
          register_number,
          driver_category,
          expires_at,
          email: user.email,
          userId: user.userId,
        })
        .then((response) => setStatus(response.status));
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Box mt={-3}>
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
          onSubmit={handleSubmit(handleUpdateDriverLicence)}
        >
          <Heading size="lg" fontWeight="normal">
            Driver licence
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          {(user) ? (
            <>
              <VStack spacing="8">
                <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={4}>
                  <Input
                  defaultValue={defaultRegister_number}
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
                    defaultValue={defaultDriver_category}
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
                    defaultValue={defaultExpires_at.toString()}
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
              </VStack>

              <Flex mt="8" justify="flex-end">
                <HStack spacing="4">
                <Link href="/userdashboard">
                    <Button colorScheme="whiteAlpha">
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
