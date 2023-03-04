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
} from "@chakra-ui/react";
import { Input } from "../../../components/Form/input";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../../../services/axios";
import { useContext, useState } from "react";
import { LoginContext } from "../../../contexts/LoginContext";
import { FiTrash2 } from "react-icons/fi";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
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
interface companyProps {
  id: number;
  name: string;
  cnpj: string;
  status: string;
  createdAt?: string;
}

const EditUserFormSchema = yup.object().shape({
  name: yup.string(),
  email: yup.string().email(),
  document: yup
    .string()
    .min(10, "Minimum 10 characteres")
    .max(14, "Maximum 14 characteres"),
});

export default function EditUser() {

  

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

  const {
    data: companyData,
    isLoading: isCompanyLoading,
    error: errorCompany,
  } = useQuery<companyProps[]>(
    `companylist`,
    async () => {
      const response = await api.get(`/company/list`);
      console.log(response.data);
      return response.data;
    },
    {
      enabled: !!data,
    }
  );

  const [selectedNewUserCompany, setSelectedNewUserCompany] = useState(0)

  const toast = useToast();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(EditUserFormSchema),
  });

  const { errors, isSubmitting } = formState;

  function deleteUser() {
    api
      .delete(`/user/delete/${id}`)
      .then((response) => {
        toast({
          title: "User deleted",
          description: `${data?.name} was deleted successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        router.push("/users");
      })
      .catch((err) => {
        toast({
          title: "Something went wrong",
          description: `Something went wrong when deleting ${data?.name}.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      });
  }


  const handleEditUser: SubmitHandler<EditUserFormSchema> = async ({
    email,
    name,
    document,
  }) => {

    if(selectedNewUserCompany === 0){
        toast({
            title: "Select a company",
            description: `You have to manually choose a company before continue.`,
            status: "info",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });

        return ;
    }

    await api
      .post("/user/update", {
        id: data?.id,
        email,
        companyId: selectedNewUserCompany
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
              <Button
                color={'gray.400'}
                onClick={deleteUser}
                bg="gray.900"
                _hover={{ bg: "red.500", color: 'white'}}
              >
                <Icon mr={1.5} as={FiTrash2} />
                Delete user
              </Button>
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

            {data?.companyId ? (
              <>
                <Text fontSize={"2xl"} w="100%" mb={"1rem"}>
                  Company
                </Text>

                <Divider my="6" borderColor="gray.700" />
                <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
                  <Input
                    defaultValue={
                      companyData?.filter(
                        (company) => company?.id === data?.companyId
                      )[0].name
                    }
                    name="companyname"
                    label="Name"
                    isDisabled
                  />

                  <Input
                    defaultValue={
                      companyData?.filter(
                        (company) => company?.id === data?.companyId
                      )[0].cnpj
                    }
                    name="document"
                    label="CNPJ/Number"
                    {...register("document")}
                    isDisabled
                  />
                </SimpleGrid>

                <SimpleGrid
                  minChildWidth="240px"
                  spacing="8"
                  w="100%"
                  mb={"1rem"}
                >
                  <Input
                    defaultValue={dayjs(
                      companyData?.filter(
                        (company) => company?.id === data?.companyId
                      )[0].createdAt
                    ).format("dddd, MMMM D, YYYY h:mm A")}
                    name="createdat"
                    label="Created at"
                    isDisabled
                  />

                  <Input
                    defaultValue={
                      companyData?.filter(
                        (company) => company?.id === data?.companyId
                      )[0].status
                    }
                    name="status"
                    label="Status"
                    isDisabled
                  />
                </SimpleGrid>

                <Text color={"gray.200"} w={"100%"}>
                  Set{" "}
                  <Text as={"span"} color="blue.500">
                    {data?.name}
                  </Text>{" "}
                  a new company:
                </Text>
                <SimpleGrid
                  minChildWidth="240px"
                  spacing="8"
                  w="100%"
                  mb={"4rem"}
                >
                  <Select onChange={(e) => setSelectedNewUserCompany(Number(e.target.value))} color={"gray.400"} border="none" bg={"gray.900"}>
                    {companyData?.map((company) => {
                      return (
                        <option  key={company?.id} value={company?.id}>
                          {company?.name}
                        </option>
                      );
                    })}
                  </Select>
                </SimpleGrid>
              </>
            ) : (
              <>
                <Divider my="6" borderColor="gray.700" />
                <Text mb={"0.8rem"} w={"100%"}>
                  Associate{" "}
                  <Text color={"blue.500"} as={"span"}>
                    {data?.name}
                  </Text>{" "}
                  to a company:
                </Text>
                <SimpleGrid
                  minChildWidth="240px"
                  spacing="8"
                  w="100%"
                  mb={"4rem"}
                >
                  <Select onChange={(e) => setSelectedNewUserCompany(Number(e.target.value))} color={"gray.400"} border="none" bg={"gray.900"}>
                    {companyData?.map((company) => {
                      return (
                        <option  key={company?.id} value={company?.id}>
                          {company?.name}
                        </option>
                      );
                    })}
                  </Select>
                </SimpleGrid>
              </>
            )}

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
