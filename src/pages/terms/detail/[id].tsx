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
    Icon,
  } from "@chakra-ui/react";
  import Link from "next/link";
  import { Input } from "../../../components/Form/input";
  import { Header } from "../../../components/Header";
  import { Sidebar } from "../../../components/Sidebar";
  import { SubmitHandler, useForm } from "react-hook-form";
  import * as yup from "yup";
  import { yupResolver } from "@hookform/resolvers/yup";
  import { api } from "../../../services/axios";
  import { GetServerSideProps } from "next";
  import { decode } from "jsonwebtoken";
  import { parseCookies } from "nookies";
  import { Footer } from "../../../components/footer";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { FiTrash2 } from "react-icons/fi";
  
  export type DecodedToken = {
    sub: string;
    iat: number;
    exp: number;
    roles: string[];
    name: string;
  };
  
  type CreateTermFormData = {
    title: string;
    description: string;
  };

  interface TermsProps {
    id: number;
    title: string;
    text: string;
    createdAt: string;
  }
  
  const createTermFormSchema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required()
  });
  
  export default function CreateTerm() {
    const toast = useToast();

    const router = useRouter();

    const id = Number(router.query.id);

    const { data, isLoading, error, refetch } = useQuery<TermsProps>(
        `termsdetail${id}`,
        async () => {
          const response = await api.get(`/terms/list/${id}`);
    
          return response.data;
        },
        {
            enabled: !!id
        }
      );
  
    const { register, handleSubmit, formState, resetField } = useForm({
      resolver: yupResolver(createTermFormSchema),
    });
  
    const { errors } = formState;
  
    const handleCreateTerm: SubmitHandler<CreateTermFormData> = async ({
      title,
      description,
    }) => {
      await api
        .post("/terms/update", {
          id,
          title,
          text: description,
        })
        .then((response) => {
          toast({
            title: "Term created",
            description: `${title} was created successfully.`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
  
          router.push('/terms')
        })
        .catch((err) => {
          toast({
            title: "Something went wrong",
            description: `Error when creating term ${title}.`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        });
    };

    async function deleteTerm(){
        await api
        .delete(`/terms/delete/${id}`)
        .then((response) => {
          toast({
            title: "Term deleted",
            description: `${data?.title} was deleted successfully.`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          router.push("/terms");
        })
        .catch((err) => {
          toast({
            title: "Something went wrong",
            description: `Something went wrong when deleting ${data?.title}.`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        });
    }
  
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
            p="8"
            mt={5}
            onSubmit={handleSubmit(handleCreateTerm)}
          >
            <Flex justify={'space-between'} align='center'> 
                <Heading size="lg" fontWeight="normal">
                Add a term
                </Heading>

                <Button
                color={"gray.400"}
                onClick={deleteTerm}
                bg="gray.900"
                _hover={{ bg: "red.500", color: "white" }}
                >
                <Icon mr={1.5} as={FiTrash2} />
                Delete term
                </Button>
            </Flex>
  
            <Divider my="6" borderColor="gray.700" />
  
            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                <Input
                  defaultValue={data?.title}
                  name="title"
                  label="Title"
                  {...register("title")}
                  error={errors.title}
                  autoComplete={"off"}
                />
              </SimpleGrid>

              <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                <Input
                  defaultValue={data?.text}
                  name="description"
                  label="Description"
                  h={'10rem'}
                  {...register("description")}
                  error={errors.description}
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
                <Link href="/terms" passHref>
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
  