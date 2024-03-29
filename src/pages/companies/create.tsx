import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { Input } from "../../components/Form/input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../../services/axios";
import { GetServerSideProps } from "next";
import { decode } from "jsonwebtoken";
import { parseCookies } from "nookies";
import { Footer } from "../../components/footer";

export type DecodedToken = {
  sub: string;
  iat: number;
  exp: number;
  roles: string[];
  name: string;
};

type CreateCompanyFormData = {
  company: string;
  cnpj: string;
};

const createCompanyFormSchema = yup.object().shape({
  company: yup.string().required(),
  cnpj: yup.string().required()
});

export default function CreateCompany() {
  const toast = useToast();

  const { register, handleSubmit, formState, resetField } = useForm({
    resolver: yupResolver(createCompanyFormSchema),
  });

  const { errors } = formState;

  const handleCreateUser: SubmitHandler<CreateCompanyFormData> = async ({
    company,
    cnpj,
  }) => {
    await api
      .post("/company/create", {
        name: company,
        cnpj,
      })
      .then((response) => {
        toast({
          title: "Company created",
          description: `${company} was created successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        resetField("company");
        resetField("cnpj");
        resetField("responsable_name");
        resetField("email");
        resetField("phone");
        resetField("hours");
      })
      .catch((err) => {
        toast({
          title: "Company already exists.",
          description: `${company} was already registered before.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  return (
    <Box mt={-3}>
      <Header />

      <Flex w="100%" my="6" maxWidth={1600} mx="auto" px="6">
        <Sidebar />

        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          maxH={'20rem'}
          p="8"
          mt={5}
          onSubmit={handleSubmit(handleCreateUser)}
        >
          <Heading size="lg" fontWeight="normal">
            Add a company
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Input
                name="company"
                label="Company"
                {...register("company")}
                error={errors.company}
                autoComplete={"off"}
              />
              <Input
                name="cnpj"
                label="CNPJ"
                {...register("cnpj")}
                error={errors.cnpj}
                autoComplete={"off"}
              />
            </SimpleGrid>

            {/* <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Input
              
                name="responsable_name"
                label="Responsable name"
                {...register("responsable_name")}
                error={errors.responsable_name}
                autoComplete={"off"}
              />
              <Input
                name="email"
                label="E-mail"
                {...register("email")}
                error={errors.email}
                autoComplete={"off"}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
              <Input
                name="phone"
                label="Phone"
                type={"number"}
                {...register("phone")}
                error={errors.phone}
                autoComplete={"off"}
              />
              <Input
                name="hours"
                label="Contracted hours"
                {...register("hours")}
                error={errors.hours}
                maxLength={3}
                autoComplete={"off"}
              />
            </SimpleGrid> */}
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/companies" passHref>
                <Button as={"a"} colorScheme="whiteAlpha">
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
        </Box>
      </Flex>

      <Flex>
        <Flex w={{ lg: "275px" }}></Flex>
        <Footer />
      </Flex>
    </Box>
  );
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { auth } = parseCookies(ctx);

//   const decodedUser = decode(auth as string) as DecodedToken;

//   const necessaryRoles = ["ADMINISTRATOR"];

//   if (necessaryRoles?.length > 0) {
//     const hasAllRoles = necessaryRoles.some((role) => {
//       return decodedUser?.roles?.includes(role);
//     });

//     if (!hasAllRoles) {
//       console.log(hasAllRoles);
//       return {
//         redirect: {
//           destination: "/home",
//           permanent: false,
//         },
//       };
//     }
//   }

//   return {
//     props: {},
//   };
// };
