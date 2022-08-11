import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  useToast
} from "@chakra-ui/react";
import Modal from "react-modal";
import Link from "next/link";
import { Input } from "../components/Form/input";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../services/axios";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaUnlockAlt } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";

type EditCompanyFormData = {
  company: string;
  cnpj: string;
  responsable_name: string;
  email: string;
  phone: number;
  hours: number;
  companyId: string;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditCompanyFormSchema = yup.object().shape({
  company: yup.string().required(),
  cnpj: yup.string().required(),
  responsable_name: yup.string().required().min(4, "Minimum 6 letters."),
  email: yup.string(),
  phone: yup.number(),
  hours: yup.number(),
});

export default function EditCompany({
  setIsEditMode,
  company,
  cnpj,
  email,
  phone,
  hours: propsHours,
  responsable_name,
  companyId,
}: EditCompanyFormData) {
  const { register, handleSubmit, formState, resetField } = useForm({
    resolver: yupResolver(EditCompanyFormSchema),
  });

  const toast = useToast()

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { errors } = formState;

  const handleEditCompany: SubmitHandler<EditCompanyFormData> = async ({
    cnpj,
    company,
    responsable_name,
    email,
    phone,
    hours
  }) => {
    await api
      .put("editcompany", {
        cnpj,
        company,
        responsable_name,
        email,
        phone,
        hours,
        companyId
      })
      .then((response) => {
        toast({
          title: "Company updated",
          description: `${company} was updated successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
      })
      .catch((err) => {
        toast({
          title: "Something went wrong",
          description: `${company} couldn't be updated.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
      });
  };

  async function deleteCompany(id: string){
    await api
      .put("disablecompany", {
        id
      })
    .then((response) => {
      toast({
        title: "Company disabled",
        description: `${company} was disabled successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      window.location.reload()
    })
    .catch((err) => {
      toast({
        title: "Something went wrong",
        description: `${company} couldn't be disabled.`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    });
  }

  

  return (
    <Box
      as="form"
      flex="1"
      borderRadius={8}
      bg="gray.800"
      p="8"
      mt={5}
      onSubmit={handleSubmit(handleEditCompany)}
    >
      <Flex justify={'space-between'} align='center'>
      <Heading size="lg" fontWeight="normal">
        Edit company
      </Heading>
      <Button bg='red.500' _hover={{bg:'red.400'}} onClick={() => setIsModalOpen(true)}>
            <Icon mr={1.5} as={FiTrash2} />
            Disable company
          </Button>
      </Flex>

      <Divider my="6" borderColor="gray.700" />

      <VStack spacing="8">
        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
          <Input
            defaultValue={company}
            name="company"
            label="Company"
            {...register("company")}
            error={errors.company}
            autoComplete={"off"}
          />
          <Input
            defaultValue={cnpj}
            name="cnpj"
            label="CNPJ"
            {...register("cnpj")}
            error={errors.cnpj}
            autoComplete={"off"}
          />
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
          <Input
            defaultValue={responsable_name}
            name="responsable_name"
            label="Responsable name"
            {...register("responsable_name")}
            error={errors.responsable_name}
            autoComplete={"off"}
          />
          <Input
            defaultValue={email}
            name="email"
            label="E-mail"
            {...register("email")}
            error={errors.email}
            autoComplete={"off"}
          />
        </SimpleGrid>

        <SimpleGrid minChildWidth="240px" spacing="8" w="100%">
          <Input
            defaultValue={phone}
            name="phone"
            label="Phone"
            type={"number"}
            {...register("phone")}
            error={errors.phone}
            autoComplete={"off"}
          />
          <Input
            defaultValue={propsHours}
            name="hours"
            label="Contracted hours"
            {...register("hours")}
            error={errors.hours}
            maxLength={3}
            type='number'
            autoComplete={"off"}
          />
        </SimpleGrid>
      </VStack>

      <Flex mt="8" justify="flex-end">
        <HStack spacing="4">
          <Button
            onClick={() => {
              setIsEditMode(false);
            }}
            colorScheme="whiteAlpha"
          >
            Cancel
          </Button>
          <Button
            isLoading={formState.isSubmitting}
            type={'submit'}
            colorScheme="blue"
          >
            Save
          </Button>
        </HStack>
      </Flex>

      

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        overlayClassName="react-modal-overlay"
        className="react-modal-delete-message"
        ariaHideApp={false}
      >
        <SimpleGrid
          flex="1"
          gap="1"
          minChildWidth="320px"
          alignItems="flex-start"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems={"center"}
            mb={2}
          >
            <Text fontSize={"2xl"}>Disable company</Text>
            <Icon
              fontSize={20}
              as={IoMdClose}
              onClick={() => {
                setIsModalOpen(false);
              }}
              cursor={"pointer"}
            />
          </Box>
          <Divider orientation="horizontal" />

          <Box my={"4"}>
            <Text mb={2} fontSize={"md"}>
              Do you really want to disable this speedway? All users registered to this company are going to be disconnected from {company}.
            </Text>
            <Text color={"gray.300"} mb={2} fontSize={"md"}>
              If you want to enable this company again, an e-mail will be sent to the responsable for the company informing the new secret key.
            </Text>
          </Box>

          <Flex justify={"flex-end"}>
            <HStack spacing={4}>
              <Button
                type="submit"
                onClick={() => setIsModalOpen(false)}
                colorScheme={"whiteAlpha"}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                onClick={() => {
                  deleteCompany(companyId)
                }}
                colorScheme={"red"}
              >
                Disable
              </Button>
            </HStack>
          </Flex>
        </SimpleGrid>
      </Modal>
    </Box>
  );
}
