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

type EditCompanyFormData = {
  id: number;
  company: string;
  cnpj: string;
  status: string;
};

interface companyProps {
  id: number;
  name: string;
  cnpj: string;
  status: string;
  createdAt?: string;
}

const EditCompanyFormSchema = yup.object().shape({
  company: yup.string().required(),
  cnpj: yup.string().required(),
});

export default function EditCompany() {
  const router = useRouter();
  const id = Number(router.query.id);

  const {
    data: companyData,
    isLoading: isCompanyLoading,
    error: errorCompany,
  } = useQuery<companyProps>(
    `company${id}`,
    async () => {
      const response = await api.get(`/company/list/${id}`);
      console.log(response.data);
      return response.data;
    },
    {
      enabled: !!id,
    }
  );

  const toast = useToast();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(EditCompanyFormSchema),
  });

  const { errors, isSubmitting } = formState;

  function deleteCompany() {
    api
      .delete(`/company/delete/${id}`)
      .then((response) => {
        toast({
          title: "company deleted",
          description: `${companyData?.name} was deleted successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        window.location.reload();
      })
      .catch((err) => {
        toast({
          title: "Something went wrong",
          description: `Something went wrong when deleting ${companyData?.name}.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      });
  }


  const handleEditUser: SubmitHandler<EditCompanyFormData> = async ({
    cnpj,
    company,
    id,
    status,
  }) => {
    await api
      .put("/company/update", {
        id: companyData?.id,
        name: company,
        cnpj,
        status,
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
                Edit company
              </Heading>
              <Button
                color={'gray.400'}
                onClick={deleteCompany}
                bg="gray.900"
                _hover={{ bg: "red.500", color: 'white'}}
              >
                <Icon mr={1.5} as={FiTrash2} />
                Delete company
              </Button>
            </Flex>

            <Divider my="6" borderColor="gray.700" />

            <SimpleGrid minChildWidth="240px" spacing="8" w="100%" mb={'10rem'}>
              <Input
                defaultValue={companyData?.name}
                name="company"
                label="Company"
                {...register("company")}
                error={errors.company}
                autoComplete={"off"}
              />
              <Input
                defaultValue={companyData?.cnpj}
                name="cnpj"
                label="CNPJ"
                {...register("cnpj")}
                error={errors.cnpj}
                autoComplete={"off"}
              />
            </SimpleGrid>

            <Flex w={"100%"} mt="8" justify="flex-end">
              <HStack spacing="4">
                <Link href="/companies">
                  <Button colorScheme="whiteAlpha">Cancel</Button>
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
