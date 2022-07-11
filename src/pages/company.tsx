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
import { useQuery } from "react-query";

type UpdateUserCompany = {
  secret_key: string;
};

type CompanyDataProps = {
  company_name: string;
  cnpj: string;
  responsable_name: string;
  email: string;
  phone: string;
};

const createUserFormSchema = yup.object().shape({
  secret_key: yup.string().required(),
});

export default function Company() {
  const { user } = useContext(LoginContext);

  const [status, setStatus] = useState(0);

  const [responsableName, setResponsableName] = useState("");
  const [responsableEmail, setResponsableEmail] = useState("");
  const [responsablePhone, setResponsablePhone] = useState("");

  const [company, setCompany] = useState("");
  const [cnpj, setCnpj] = useState("");

  useEffect(() => {
    
      if ((company == "") && !(user?.companyRef == "")) {
        api
          .get<CompanyDataProps>(
            `getcompanydata?companyRef=${user?.companyRef}`
          )
          .then((response) => {
            console.log(response);
            setCompany(response.data.company_name);
            setCnpj(response.data.cnpj);

            setResponsableName(response.data.responsable_name);
            setResponsableEmail(response.data.email);
            setResponsablePhone(response.data.phone)
          });
      }
    

    // use user._id
  }, [user]);

  useEffect(() => {
    if(status == 200){
      toast.success('Connected to company')
      window.location.reload()
    }
  }, [status])

  

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(createUserFormSchema),
  });

  const { errors } = formState;

  const handleAddSecretKey: SubmitHandler<UpdateUserCompany> = async ({
    secret_key,
  }) => {
    console.log();
    // Router.push('/speedways')
    try {
      const response = await api
        .post("connecttonewcompany", {
          secret_key,
          userId: user?.userId,
          email: user?.email,
        })
        .then((response) => setStatus(response.status));
    } catch (err) {
      toast.error("Code not found");
    }
  };

  return (
    <Box mt={-3}>
      <Header />

      <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6" mb={"14"}>
        <Sidebar />

        <Box
          as="form"
          flex="1"
          height={"100%"}
          borderRadius={8}
          bg="gray.800"
          p="8"
          mt={5}
          onSubmit={handleSubmit(handleAddSecretKey)}
        >
          <Heading size="lg" fontWeight="normal">
            Company
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          {!(user?.companyRef == "") ? (
            <>
              {company == "" ? (
                <Flex justify="center">
                  <Spinner mt="110px" mb="110px" />
                </Flex>
              ) : (
                <VStack spacing="8">
                  <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={4}>
                    <Input
                      isDisabled={true}
                      defaultValue={responsableName}
                      name="responsable name"
                      label="Responsable name"
                    />
                  </SimpleGrid>

                  <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={4}>
                    <Input
                      isDisabled={true}
                      defaultValue={responsableEmail}
                      name="responsable email"
                      label="E-mail"
                    />

                    <Input
                      isDisabled={true}
                      defaultValue={responsablePhone}
                      name="responsable phone"
                      label="Phone"
                    />
                  </SimpleGrid>

                  <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={4}>
                    <Input
                      isDisabled
                      defaultValue={company}
                      name="company"
                      label="Company name"
                    />

                    <Input
                      isDisabled
                      defaultValue={cnpj}
                      name="cnpj"
                      label="CNPJ"
                    />
                  </SimpleGrid>
                </VStack>
              )}

              <Flex mt="8" justify="flex-end">
                <HStack spacing="4">
                  <Link href="/userdashboard">
                    <Button colorScheme="whiteAlpha">Cancel</Button>
                  </Link>
                  <Button disabled colorScheme="blue">
                    Save
                  </Button>
                </HStack>
              </Flex>
            </>
          ) : (
            <>
              <Box mb={"8"}>
                <Text fontSize={"2xl"} mb={6}>
                  Hello, {user?.name}
                </Text>

                <Text color={"gray.300"} mb={2}>
                  • The secret code of your company was sent to your manager.
                </Text>
                <Text color={"gray.300"}>
                  • It's obligatory to have secret key to be able to schedule
                  speedways.
                </Text>
              </Box>

              <VStack spacing="8">
                <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={4}>
                  <Box>
                    <Input
                      name="secret_key"
                      label="Secret key"
                      {...register("secret_key")}
                      error={errors.new_password}
                    />
                    <Text ml={2} mt={2} color="gray.500">
                      Ex: S6Z49H4-TE0CPYD-38Z8WF6
                    </Text>
                  </Box>
                </SimpleGrid>
              </VStack>

              <Flex mt="8" justify="flex-end">
                <HStack spacing="4">
                  <Link href="/userdashboard">
                    <Button colorScheme="whiteAlpha">Cancel</Button>
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
          )}
        </Box>
      </Flex>
    </Box>
  );
}
