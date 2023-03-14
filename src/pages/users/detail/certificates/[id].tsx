import {
    Flex,
    Button,
    Icon,
    Divider,
    Text,
    VStack,
    SimpleGrid,
    Box,
    Heading,
    HStack,
    useToast,
    Checkbox,
    Select,
    Link,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
  } from "@chakra-ui/react";
  import { Input } from "../../../../components/Form/input";
  import { SubmitHandler, useForm } from "react-hook-form";
  import * as yup from "yup";
  import { yupResolver } from "@hookform/resolvers/yup";
  import { api } from "../../../../services/axios";
  import { useContext, useState } from "react";
  import { LoginContext } from "../../../../contexts/LoginContext";
  import { FiTrash2 } from "react-icons/fi";
  import dayjs from "dayjs";
  import { useQuery } from "react-query";
  import { useRouter } from "next/router";
  import { Header } from "../../../../components/Header";
  import { Sidebar } from "../../../../components/Sidebar";
  import { MdDone } from "react-icons/md";
  import { AiOutlineClose } from "react-icons/ai";
  
  type EditUserFormSchema = {
    name: string;
    email: string;
    document: string;
  };
  
  interface UserProps {
    id: number;
    name: string;
    email: string;
    document: string;
    companyId?: number;
    isForeigner: boolean;
  }
  interface certificateProps {
    id: number;
    certificateName: string;
    certificateCode: string;
    certificateType: string;
  }
  
  const EditUserFormSchema = yup.object().shape({
    name: yup.string(),
    email: yup.string().email(),
    document: yup
      .string()
      .min(10, "Minimum 10 characteres")
      .max(14, "Maximum 14 characteres"),
  });
  
  export default function UserCertificates() {
  
    
  
    const router = useRouter();
    const id = Number(router.query.id);
  
    const { data, isLoading, error, refetch } = useQuery<UserProps>(
      `userlistt`,
      async () => {
        const response = await api.get(`/user/list/${id}`);
        console.log(response.data);
        return response.data;
  
        //   setTotal(20);
        return;
      },
      {
        enabled: !!id,
      }
    );

    const { data:certificatesData, isLoading:certificatesIsLoading, error:certificatesError } = useQuery<certificateProps[]>(
        `certificates`,
        async () => {
          const response = await api.get(`/certificate/list`);
          return response.data;
        },
        {
          enabled: !!data
        }
      );

  
    const toast = useToast();
  
    const { register, handleSubmit, formState } = useForm({
      resolver: yupResolver(EditUserFormSchema),
    });
  
    const { errors, isSubmitting } = formState;
  
  
    const handleEditUser: SubmitHandler<EditUserFormSchema> = async ({
      email,
      name,
      document,
    }) => {
  
      await api
        .post("/user/update", {
          id: data?.id,
          email,
        })
        .then((response) => {
          toast({
            title: "User updated",
            description: `${name} was updated successfully.`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Something went wrong",
            description: `Something went wrong when updaring ${name}.`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        });
  
      return;
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
            p="8"
            mt={5}
            onSubmit={handleSubmit(handleEditUser)}
          >
            <VStack spacing={4}>
              <Flex
                w={"100%"}
                mb={3}
                justify="space-between"
                alignItems={"center"}
              >
                <Heading size="lg" fontWeight="normal">
                  Edit user
                </Heading>
              </Flex>
  
              <Divider my="6" borderColor="gray.700" />
  
              <Flex justify={"start"} w="100%" mb={"1rem"}>
                <HStack>
                  {data?.isForeigner ? (
                    <Flex color={"blue.500"} alignItems={"center"}>
                      <Text mr="0.2rem">Is foreigner</Text>
                      <MdDone size={"1.2rem"} />
                    </Flex>
                  ) : (
                    <Flex color={"gray.500"} alignItems={"center"}>
                      <Text mr="0.2rem">Not foreigner</Text>
                      <AiOutlineClose size={"1.2rem"} />
                    </Flex>
                  )}
                </HStack>
              </Flex>
  
              <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                <Input
                  defaultValue={data?.name}
                  name="name"
                  label="Full name"
                  {...register("name")}
                  error={errors.name}
                  isDisabled
                />
  
                <Input
                  defaultValue={data?.email}
                  name="document"
                  label="Document"
                  {...register("document")}
                  error={errors.document}
                  maxLength={10}
                  isDisabled
                />
              </SimpleGrid>
  
              <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={"2rem"}>
                <Input
                  defaultValue={data?.email}
                  name="email"
                  label="E-mail"
                  type={"email"}
                  {...register("email")}
                  error={errors.email}
                  isDisabled
                />
              </SimpleGrid>
  
              <Text fontSize={"2xl"} w="100%" mb={"1rem"}>
                    User certificates
                  </Text>
  
                  <Divider my="6" borderColor="gray.700" />

                  <Table colorScheme="whiteAlpha">
                    <Thead>
                      <Tr>
                        <Th px={["4", "4", "6"]} color="gray.300" width="">
                          <Text>Id</Text>
                        </Th>
                        <Th>Name</Th>
                        <Th>Licence</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    
                      <Tbody>
                       {certificatesData?.map(certificate => {
                        return (
                            <Tr
                            _hover={{
                              bg: "gray.900",
                              color: "gray.300",
                              transition: "0.2s",
                              cursor: "pointer",
                            }}
                            key={certificate?.id}
                          >
                            <Td px={["4", "4", "6"]}>
                              <Text fontWeight="bold">{certificate?.id}</Text>
                            </Td>
  
  
                            <Td>
                              <Text color={"gray.300"}>{certificate?.certificateName}</Text>
                            </Td>
                            <Td>
                              <Text color={"gray.300"}>{certificate?.certificateType}</Text>
                            </Td>
                            <Td>
                              <Text color={"gray.300"}>Pending</Text>
                            </Td>
                          </Tr>
                        )
                       })}
                    </Tbody>
                    </Table>
  
              <Flex w={"100%"} mt="8" justify="flex-end">
                <HStack spacing="4">
                <Link href="/users">
                  <Button
                    colorScheme="whiteAlpha"
                  >
                    Cancel
                  </Button>
                  </Link>
                  <Button
                    isLoading={formState.isSubmitting}
                    type={"submit"}
                    colorScheme="blue"
                  >
                    Save
                  </Button>
                </HStack>
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
          </Box>
        </Flex>
      </Box>
    );
  }
  